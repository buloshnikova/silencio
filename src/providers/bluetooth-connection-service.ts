import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController } from "ionic-angular";

/*
  Generated class for the BluetoothConnectionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class BluetoothConnectionProvider {

  public var2: string ;
  public lists = [];
  public connection_status: string = "";
  public connection_error: string = "";

  constructor(public http: Http,
              private bluetoothSerial: BluetoothSerial,
              private alertCtrl:AlertController) {

    this.getAlBluetoothDevices();

  }

  getAlBluetoothDevices(){

    // async so keep everything in this method
    this.bluetoothSerial.isEnabled().
    then((data)=> {
      // not sure of returning value, probably a boolean
      console.log("dont know what it returns"+data);

      // returns all the available devices, not just the unpaired ones
      this.bluetoothSerial.list().then((allDevices) => {
        console.log(allDevices);

        // data format of paired devices
        // address : "F5:06:FC:70:EA:0D"
        // class : 1032
        // id : "F5:06:FC:70:EA:0D"
        // name : "BS-01"

        // set the list to returned value
        this.lists = allDevices;

        // set connection status default false
        for(let item of this.lists) {
          item.isConnected = false;
        }
        if(!(this.lists.length > 0)){
          this.var2 = "could not find any bluetooth devices";
          alert(this.var2);
        }

      });
    }).catch( (reason => {
      console.log(reason);
    }));
  }

  connectDevice(device) {
    console.log(device.address);

    this.bluetoothSerial.connect(device.address).subscribe((data) => {
      device.isConnected = true;
      this.connection_error = '';
      this.connection_status = 'Bluetooth connection: ' + data;

      this.bluetoothSerial.isConnected().then((data) => console.log(data));

      this.alertCtrl.create({
        title: "Device " + device.name + " is connected",
        buttons: ["Close"]
      }).present();
    }, error => {
      device.isConnected = false;
      this.connection_status = '';
      this.connection_error = 'Error: ' + error;

      this.alertCtrl.create({
        title: "Error while connecting to " + device.name,
        subTitle: error,
        buttons: ["Close"]
      }).present();
    });
  }

  disconnectDevice(device) {

    this.bluetoothSerial.disconnect();
    device.isConnected = false;
    this.connection_status = "";
    this.connection_error = "";

    this.alertCtrl.create({
      title: "Device "  + device.name + " is disconnected",
      buttons: ["Close"]
    }).present();

  }

  // send parameters to the connected bluetooth
  // param example to light on a led with specific color
  // "255,1,1"
  //
  // param example to light off a led:
  // "0"
  bluetoothWrite(rgbColorString:string){
    this.bluetoothSerial.write(rgbColorString);
  }

}
