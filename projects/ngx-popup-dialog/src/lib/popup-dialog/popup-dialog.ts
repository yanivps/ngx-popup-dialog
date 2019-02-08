import { ComponentType } from '@angular/cdk/portal';
import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener,
  Inject,
  ReflectiveInjector,
  TemplateRef,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

export declare type Direction = 'ltr' | 'rtl';

export interface PopupDialogConfig {
  triggeringElement: any;
  component: ComponentType<any> | TemplateRef<any>;
  coverTriggeringElement?: boolean;

  direction?: Direction;
}

export interface PopupDialogData {
  config: PopupDialogConfig;
  data: any;
}

interface OutOfViewport {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
  any: boolean;
  all: boolean;
}

@Component({
  selector: 'popup-dialog',
  templateUrl: 'popup-dialog.html',
  styleUrls: ['popup-dialog.css'],
  encapsulation: ViewEncapsulation.None
})
export class PopupDialog {
  @ViewChild('popupContent', { read: ViewContainerRef }) popupContentViewContainer: ViewContainerRef;
  @ViewChild('dialogContainer') protected dialogContainerRef: ElementRef;
  visible = false;
  isOpened = false;
  scaleBottomToTop = false;
  direction?: 'ltr' | 'rtl';

  config: PopupDialogConfig;
  data: any;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public dialogRef: MatDialogRef<PopupDialog>,
    @Inject(MAT_DIALOG_DATA) data: PopupDialogData) {
    this.config = data.config;
    this.data = data.data;
    this.direction = data.config.direction
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    this.positionDialogWhereTriggeringElement();
    this.positionDialogUpIfBottomOutsideViewport();
  }

  @HostListener('document:mousedown', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:click', ['$event'])
  onclick(event) {
    if (!this.isOpened) return;

    var container = this.dialogContainerRef.nativeElement;
    if (container !== event.target && !this.childOf(event.target, container)) {
      this.closeDialog(event.target);
    };
  }

  ngOnInit() {
    this.loadComponent();
    this.dialogRef.beforeClose().subscribe(x => {
      this.visible = false;
    })
    this.dialogRef.afterOpen().subscribe(x => {
      this.isOpened = true;
    })
    this.positionDialogWhereTriggeringElement();
    this.positionDialogUpIfBottomOutsideViewport();
    this.visible = true;
  }

  loadComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.component as Type<any>);

    this.popupContentViewContainer.clear();

    const injector = ReflectiveInjector.resolveAndCreate([
      {
        provide: MAT_DIALOG_DATA,
        useValue: this.data || {}
      }
    ]);
    let componentRef = this.popupContentViewContainer.createComponent(componentFactory, 0, injector);
  }

  private positionDialogWhereTriggeringElement() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.config.triggeringElement.getBoundingClientRect();
    let top = this.config.coverTriggeringElement ?
      rect.bottom - this.config.triggeringElement.offsetHeight - 1 :
      rect.bottom

    let left = this.direction == 'rtl' ?
      rect.left - this.dialogContainerRef.nativeElement.offsetWidth + this.config.triggeringElement.offsetWidth :
      rect.left;
    matDialogConfig.position = { left: `${left}px`, top: `${top}px` };
    this.dialogRef.updatePosition(matDialogConfig.position);
  }

  private positionDialogUpIfBottomOutsideViewport() {
    let dialogContainerElem = this.dialogContainerRef.nativeElement as HTMLElement;
    let result = this.isOutOfViewport(dialogContainerElem);

    if (result.bottom) {
      this.scaleBottomToTop = true;
      const matDialogConfig: MatDialogConfig = new MatDialogConfig();
      const rect = dialogContainerElem.getBoundingClientRect();
      let triggeringElementHeight = this.config.triggeringElement.offsetHeight;
      let top = this.config.coverTriggeringElement ?
        rect.top - dialogContainerElem.offsetHeight + triggeringElementHeight + 1 :
        rect.top - dialogContainerElem.offsetHeight - triggeringElementHeight
      matDialogConfig.position = { left: `${rect.left}px`, top: `${top}px` };
      this.dialogRef.updatePosition(matDialogConfig.position);
    } else {
      this.scaleBottomToTop = false;
    }
  }

  private isOutOfViewport(elem): OutOfViewport {
    // Get element's bounding
    var bounding = elem.getBoundingClientRect();

    // reduce height from top position if scale to top
    let top = bounding.top;
    if (this.scaleBottomToTop) {
      top = this.config.coverTriggeringElement ?
        bounding.top - elem.offsetHeight + this.config.triggeringElement.offsetHeight :
        bounding.top - elem.offsetHeight - this.config.triggeringElement.offsetHeight
    }

    var out: any = {};
    out.top = top < 0;
    out.left = bounding.left < 0;
    out.bottom = (bounding.top + elem.offsetHeight) > (window.innerHeight || document.documentElement.offsetHeight);
    if (this.scaleBottomToTop && !out.bottom) {
      if (!out.top) out.bottom = true;
    }
    out.right = (bounding.left + elem.offsetWidth) > (window.innerWidth || document.documentElement.offsetWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;

    return out;
  };

  containerTransitionEnd(event: Event) {
    if (event.target == this.dialogContainerRef.nativeElement && !this.visible) {
      this.dialogRef.close();
    }
  }

  private closeDialog(focusElement?: HTMLElement) {
    if (focusElement) {
      this.dialogRef.afterClosed().subscribe(x => {
        focusElement.focus();
      })
    }
    this.visible = false;
  }

  private childOf(node, ancestor) {
    var child = node;
    while (child !== null) {
      if (child === ancestor) return true;
      child = child.parentNode;
    }
    return false;
  }

}
