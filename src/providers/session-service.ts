import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from "rxjs/Observable";
import { DBMeter } from '@ionic-native/db-meter';
import { SessionModel } from "../models/session.model";
import { CONST } from '../utils/config';


@Injectable()
export class SessionService {

  active_session:boolean = false;
  dbmeterData:any;
  dbmeterDataObserver:any;
  systemtimestamp:number = 0;
  items: Observable<any[]>;
  private constants = CONST;

  constructor( private http: Http,
               private dbMeter: DBMeter,
               private afDB: AngularFireDatabase ) {

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


  /*
    connect to firedatabase
    parameters
    guid: number, unique session id
    name: string, username
    start_time: number, when session has started
    end_time: number, when session has stopped
    value: number, max value of db meter
    */
  public sendSilenceParameterToServer(sessionData:SessionModel) {


    /*
    url:https://silencio-database.firebaseio.com/
    example
    {
      "session" : [ null, {
      "end_time" : 23456789,
      "guid" : 12345678,
      "name" : "ziskind.inna@gmail.com",
      "start_time" : 123456789,
      "value" : 46.789
      }]
    }
    */

    this.afDB.list('/session').push(sessionData)
      .then(()=> console.log('session sent to db: ' + sessionData.value));

    // update the same object
    // this.afDB.object(this.constants.FIRE_DATABASE.TABLE_SESSION_URL + '$' + sessionData.session_guid)
    //   .update(sessionData)
    //   .then(()=> console.log('session sent to db: ' + sessionData.value));

  }

}
