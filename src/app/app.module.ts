import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';
import {MyApp} from './app.component';
import {HttpModule, Http} from '@angular/http';
import {AuthHttp, AuthConfig,JwtHelper} from 'angular2-jwt';
import {Storage} from '@ionic/storage';
import {AuthService} from '../providers/auth-service';
import {BooksService} from '../providers/books-service';
import {SessionService} from '../providers/session-service';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {DBMeter} from '@ionic-native/db-meter';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Geolocation } from '@ionic-native/geolocation';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import { BluetoothConnectionProvider } from '../providers/bluetooth-connection-service';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyC6t1sW-jq4IxE4umLtbZ_Bp8gESV82Ccw",
  authDomain: "silencio-database.firebaseapp.com",
  databaseURL: "https://silencio-database.firebaseio.com",
  projectId: "silencio-database",
  storageBucket: "silencio-database.appspot.com",
  messagingSenderId: "622950970959"
};

let storage = new Storage({});

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token')),
  }), http);
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    JwtHelper,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http],
    },
    DBMeter,
    AuthService,
    BooksService,
    SessionService,
    BluetoothSerial,
    BluetoothConnectionProvider,
    AngularFireDatabase,
    Geolocation
  ]
})
export class AppModule {}
