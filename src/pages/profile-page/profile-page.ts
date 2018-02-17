import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {ProtectedPage} from '../protected-page/protected-page';
import {Storage} from '@ionic/storage';

import {UserModel} from '../../models/user.model';
import { BluetoothConnectionProvider } from '../../providers/bluetooth-connection-service';

@IonicPage()
@Component({
  selector: 'page-profile-page',
  templateUrl: 'profile-page.html',
})
export class ProfilePage extends ProtectedPage {

  public user: UserModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public storage: Storage,
    public _bluetooth: BluetoothConnectionProvider) {

    super(navCtrl, navParams, storage);

    this.storage.get('user').then(user => {
      this.user = user;
    });

    //this._bluetooth.getAlBluetoothDevices();
  }

  connectDevice(device) {

    // call service to connect
    this._bluetooth.connectDevice(device);

  }

  disconnectDevice(device) {

    // call service to disconnect
    this._bluetooth.disconnectDevice(device);
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true);
  }

}
