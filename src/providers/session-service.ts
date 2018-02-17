import {Injectable} from "@angular/core";
import {Http} from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {DBMeter} from '@ionic-native/db-meter';

@Injectable()
export class SessionService {

  active_session:boolean = false;
  dbmeterData:any;
  dbmeterDataObserver:any;
  systemtimestamp:number = 0;
  items: Observable<any[]>;

  constructor( private http: Http,
               private dbMeter: DBMeter,
               private afDB: AngularFireDatabase) {

    this.dbmeterData = Observable.create(observer => {
      this.dbmeterDataObserver = observer;
    });

    this.items = afDB.list('session').valueChanges();
  }

  startListening(): Observable<any> {
    let subscription = this.dbMeter.start();
    subscription.subscribe(
      data =>  {
        console.log(data);
        this.dbmeterData = data;
        this.dbmeterDataObserver.next(data);
        this.loopThroughDbMeterData(data);
      }, function(e){
        console.log('code: ' + e.code + ', message: ' + e.message);
      }
    );
    return subscription;
  }

  startListeningPeriod(): Observable<any> {
    let subscription = this.dbMeter.start();
    subscription.subscribe(
      data =>  {
        console.log(data);
        this.dbmeterData = data;
        this.dbmeterDataObserver.next(data);
        this.loopThroughDbMeterData(data);
      }, function(e){
        console.log('code: ' + e.code + ', message: ' + e.message);
      }
    );
    return subscription;
  }

  checkUpdates(): Observable<any> {
    return this.dbmeterData;
  }

  stopListening() {
    return this.dbMeter.stop();
  }

  loopThroughDbMeterData(data:any) {
    // TODO: run the loop and get max parameter
    // if parameter is lower than minimum level, send it to the server
    this.sendSilenceParameterToServer(data);

  }

  sendSilenceParameterToServer(data:any) {
    // TODO: create session guid, paste into the model and send to the server
  }

}
