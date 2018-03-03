import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DBMeter } from '@ionic-native/db-meter';
import { Geolocation } from '@ionic-native/geolocation';

import { ProtectedPage } from '../protected-page/protected-page';
import { SessionService } from '../../providers/session-service';
import { Observable } from "rxjs/Observable";
import { BluetoothConnectionProvider } from '../../providers/bluetooth-connection-service';
import { CONST } from '../../utils/config';
import { SessionModel } from '../../models/session.model';
import { UserModel } from "../../models/user.model";

@IonicPage()
@Component({
  selector: 'page-silence-session',
  templateUrl: 'silence-session.html',
})
export class SilenceSessionPage extends ProtectedPage {

  public user: UserModel;
  private dbmeterData:any;
  private noiseLevel:number;
  private subscription:any;
  private watch:any;
  private lastTimeCheckedDBMeter:number = 0;
  private lastTimeSentDataToServer:number = 0;
  private sessionStartedTime: number = 0;
  private constants = CONST;
  private dbDataMaxValue:number = 0;
  private colorToSend:any = this.constants.LED_COLOR_STRINGS.ZERO;

  private sessionDataToSend: SessionModel;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private _session: SessionService,
              public storage: Storage,
              private dbMeter: DBMeter,
              public _bluetooth: BluetoothConnectionProvider,
              private geolocation:Geolocation) {

    super(navCtrl, navParams, storage);

    this.storage.get('user').then(user => {
      this.user = user;
    });
  }

  ionViewDidLoad() {
  }

  startSession() {
    this._session.active_session = true;
    this.sessionStartedTime = new Date().getTime();


    this.subscription = this.dbMeter.start().subscribe(
      data => {

        // reduce a frequency of proceedings data to a certain interval - go into the loop every X milliseconds
        if (new Date().getTime() - this.lastTimeCheckedDBMeter > this.constants.TIME_INTERVAL_DBMETER) {

          // save the biggest noise value within this loop
          this.dbDataMaxValue = data > this.dbDataMaxValue ? data : this.dbDataMaxValue;

          // write data on the screen
          this.dbmeterData = data;

          // rewrite last time checked parameter
          this.lastTimeCheckedDBMeter = new Date().getTime();

          // check if dbmeter value doesn't exceed the max value
          if (this.dbDataMaxValue < this.constants.MAX_NOISE_VALUE && this.dbDataMaxValue > CONST.MIN_NOISE_VALUE) {

            console.log("Check this.colorToSend != this.constants.LED_COLOR_STRINGS.GREEN: " + this.colorToSend);
            if (this.colorToSend != this.constants.LED_COLOR_STRINGS.GREEN) {

              // send green color to the LED
              this._bluetooth.bluetoothWrite(this.constants.LED_COLOR_STRINGS.GREEN);

              this.colorToSend = this.constants.LED_COLOR_STRINGS.GREEN;
              console.log("write green");

            }

            if (new Date().getTime() - this.lastTimeSentDataToServer > this.constants.TIME_INTERVAL_SEND_DATA_TO_SERVER) {

              let uuid = this.guid();

              // compose session data package
              this.sessionDataToSend.session_guid = uuid;
              this.sessionDataToSend.start_time = this.sessionStartedTime;
              this.sessionDataToSend.end_time = new Date().getTime();
              this.sessionDataToSend.value = data;

              console.log(data);

              //send data to remote database
              this._session.sendSilenceParameterToServer(this.sessionDataToSend);

              this.resetSession();
            }
          }

          // in case the data is bigger than max value, set the session time to zero and start it again
          else {

            console.log("this.colorToSend: ", this.colorToSend);

            if (this.colorToSend != this.constants.LED_COLOR_STRINGS.RED) {

              // send red color to the LED
              this._bluetooth.bluetoothWrite(this.constants.LED_COLOR_STRINGS.RED);

              // send red color to the LED
              this.colorToSend = this.constants.LED_COLOR_STRINGS.RED;
              console.log("write red");
            }

            this.resetSession();
          }

        }
      }
    );
    //this._bluetooth.bluetoothWrite("255,0,0");
  }

  resetSession() {

    // rewrite session's noise max value
    this.dbDataMaxValue = CONST.MIN_NOISE_VALUE;

    // rewrite start session time and last time data sent to the server
    this.lastTimeSentDataToServer = new Date().getTime();
    this.sessionStartedTime = new Date().getTime();
  }

  stopSession() {
    this._session.active_session = false;
    this._bluetooth.bluetoothWrite(this.constants.LED_COLOR_STRINGS.ZERO);
    this.colorToSend = this.constants.LED_COLOR_STRINGS.ZERO;
    console.log("stopSession");

    this.dbMeter.stop();
    this.noiseLevel = null;
  }


  ngOnInit() {

    let timer = Observable.timer(0, 100);
    timer.subscribe(() => {
      if (this._session.active_session) {
        this.noiseLevel = this.dbmeterData;
        this.init_session_data_object();
        this.init_geolocation();
      }
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.unsubscribe_geolocation();
  }

  init_session_data_object() {
    this.sessionDataToSend = {
      session_guid: '',
      name: this.user.email,
      location: {
        latitude: 0, longitude: 0
      },
      start_time: this.sessionStartedTime,
      end_time: new Date().getTime(),
      value: 0
    };
  }

  // compose guid for a time session
  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  // get location
  init_geolocation() {
    this.watch = this.geolocation.watchPosition()
      .subscribe((geo) => {

        this.sessionDataToSend.location.latitude = geo.coords.latitude;
        this.sessionDataToSend.location.longitude = geo.coords.longitude;

      });
  }

  // unsubscribe from geolocation
  unsubscribe_geolocation() {
    this.watch.unsubscribe();
  }
}

