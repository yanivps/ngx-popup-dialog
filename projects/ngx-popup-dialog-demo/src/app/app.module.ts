import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPopupDialogModule } from 'ngx-popup-dialog';

import { AppComponent } from './app.component';
import { CoolPopupDialog } from './cool-popup-dialog/cool-popup-dialog';


@NgModule({
  declarations: [
    AppComponent,
    CoolPopupDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxPopupDialogModule.forRoot(),
    MatDialogModule
  ],
  entryComponents: [CoolPopupDialog],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
