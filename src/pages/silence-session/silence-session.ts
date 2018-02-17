import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DBMeter } from '@ionic-native/db-meter';

import { ProtectedPage } from '../protected-page/protected-page';
import { SessionService } from '../../providers/session-service';
import { Observable } from "rxjs/Observable";
import { BluetoothConnectionProvider } from '../../providers/bluetooth-connection-service';
import { CONST } from '../../utils/config';

@IonicPage()
@Component({
  selector: 'page-silence-session',
  templateUrl: 'silence-session.html',
})
export class SilenceSessionPage extends ProtectedPage {

  dbmeterData:any;
  noiseLevel:number;
  subscription:any;
  lastTime:number = 0;
  private constants = CONST;
  dbDataMaxValue:number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _session: SessionService,
              public storage: Storage,
              private dbMeter: DBMeter,
              public _bluetooth: BluetoothConnectionProvider) {

    super(navCtrl, navParams, storage);
  }

  ionViewDidLoad() {
  }

  startSession() {
    this._session.active_session = true;
    // this._session.startListening();
    // this.subscription = this._session.checkUpdates().subscribe(
    //   data =>  {
    //     console.log('page data ', this.dbmeterData);
    //     this.dbmeterData = data;
    //   }
    // );


    this.subscription = this.dbMeter.start().subscribe(
      data => {
        //this.dbDataMaxValue = data > this.dbDataMaxValue ? data : this.dbDataMaxValue;
        // reduce a frequency of proceedings data to twice in a second
        if (new Date().getTime() - this.lastTime > 500) {

          this.lastTime = new Date().getTime();
          this.dbDataMaxValue = data > this.dbDataMaxValue ? data : this.dbDataMaxValue;
          // write data on the screen
          this.dbmeterData = data;

          // check if the data is valid for proceeding
          if (this.dbDataMaxValue < this.constants.MAX_NOISE_VALUE && this.dbDataMaxValue > CONST.MIN_NOISE_VALUE) {
            console.log("this.dbDataMaxValue: " + this.dbDataMaxValue);
            //send it to remote database
          }

        }
      }
    );
    this._bluetooth.bluetoothWrite("255,0,0");
  }

  stopSession() {
    this._session.active_session = false;
    this._bluetooth.bluetoothWrite("0");
    //this._session.stopListening();
    //this.subscription.unsubscribe();

    this.dbMeter.stop();
    this.noiseLevel = null;
  }

  ngOnInit() {

    let timer = Observable.timer(0, 100);
    timer.subscribe(() => {
      if (this._session.active_session) {
        this.noiseLevel = this.dbmeterData;
        console.log('Observable.timer: ', this.dbmeterData);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
