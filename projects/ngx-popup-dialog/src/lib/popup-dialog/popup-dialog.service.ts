import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Direction, PopupDialog, PopupDialogData } from './popup-dialog';

export interface PopupDialogConfig  {
  direction?: Direction;
  coverTriggeringElement?: boolean;
  data?: any;
}

@Injectable()
export class PopupDialogService {
  constructor(
    private _overlay: Overlay,
    private _dialogService: MatDialog) { }

  open<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, triggeringElement, config?: PopupDialogConfig): MatDialogRef<PopupDialog> {
    if (!config) config = {};

    let data = config.data;
    delete config.data;
    const popupDialogData: PopupDialogData = {
      config: {
        ...config,
        component: componentOrTemplateRef,
        triggeringElement: triggeringElement
      },
      data: data
    }
    const popupDialogConfig = {
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      panelClass: 'ngx-popup-dialog-overlay',
      data: popupDialogData,

    }
    let dialogRef = this._dialogService.open(PopupDialog, popupDialogConfig);
    return dialogRef;
  }
}
