import { Overlay } from '@angular/cdk/overlay';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { Direction, PopupDialog, PopupDialogData } from './popup-dialog';

export interface PopupDialogServiceConfig {
  direction?: Direction;
  coverTriggeringElement?: boolean;
  scaleToTopOnBottomOverflow?: boolean;
  maxWidth?: number | string;
  maxHeight?: number | string;
}

export interface PopupDialogConfig extends PopupDialogServiceConfig {
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
        triggeringElement: triggeringElement,
        maxWidth: (typeof config.maxWidth === "number") ? config.maxWidth + 'px' : config.maxWidth,
        maxHeight: (typeof config.maxHeight === "number") ? config.maxHeight + 'px' : config.maxHeight,
        scaleToTopOnBottomOverflow: config.scaleToTopOnBottomOverflow == null ? true : config.scaleToTopOnBottomOverflow
      },
      data: data
    }
    const popupDialogConfig: MatDialogConfig = {
      backdropClass: 'cdk-overlay-transparent-backdrop',
      hasBackdrop: false,
      scrollStrategy: this._overlay.scrollStrategies.noop(),
      panelClass: 'ngx-popup-dialog-overlay',
      restoreFocus: false,
      data: popupDialogData
    }
    let dialogRef = this._dialogService.open(PopupDialog, popupDialogConfig);
    return dialogRef;
  }
}
