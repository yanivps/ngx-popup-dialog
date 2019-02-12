import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupDialogService } from 'ngx-popup-dialog';

import { CoolPopupDialog } from './cool-popup-dialog/cool-popup-dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public dialog: MatDialog,
    private popupDialogService: PopupDialogService) {}
  title = 'ngx-popup-dialog-demo';
  name = "Hero";
  animal = '';

  openPopupDialog(event: Event) {
    const dialogRef = this.popupDialogService.open(
      CoolPopupDialog,
      event.currentTarget,
      {
        direction: "ltr",
        // coverTriggeringElement: true,
        // scaleToTopOnBottomOverflow: false,
        // suppressCloseOnClickSelectors: ['.supress-close-container'],
        maxHeight: 600,
        data: { name: this.name, animal: this.animal }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ' + result);
      this.animal = result;
    });
  }
}
