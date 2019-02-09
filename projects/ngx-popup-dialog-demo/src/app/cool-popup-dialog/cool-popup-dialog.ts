import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface PopupDialogData {
  name: string;
  animal: string;
}

@Component({
  selector: 'app-cool-popup-dialog',
  templateUrl: './cool-popup-dialog.html',
  styleUrls: ['./cool-popup-dialog.css']
})
export class CoolPopupDialog implements OnInit {
  items = [
    "Aaaa",
    "Bbbb",
    "Cccc",
    "Dddd",
    "Eeee",
    "Ffff",
    "Gggg",
    "Hhhh",
    "Iiii",
    // "Aaaa",
    // "Bbbb",
    // "Cccc",
    // "Dddd",
    // "Eeee",
    // "Ffff",
    // "Gggg",
    // "Hhhh",
    // "Iiii"
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: PopupDialogData) {
  }

  ngOnInit() {
  }

}
