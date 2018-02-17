import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SilenceSessionPage } from './silence-session';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    SilenceSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(SilenceSessionPage),
    TranslateModule.forChild()
  ],
  exports: [
    SilenceSessionPage
  ]
})
export class SilenceSessionPageModule {}
