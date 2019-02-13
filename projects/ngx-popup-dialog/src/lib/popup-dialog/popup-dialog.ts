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
  InjectionToken,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { PopupDialogServiceConfig } from './popup-dialog.service';

export const POPUP_DIALOG_CLOSE = new InjectionToken<(dialogResult: any) => void>('POPUP_DIALOG_CLOSE');

export declare type Direction = 'ltr' | 'rtl';

export interface PopupDialogConfig extends PopupDialogServiceConfig {
  triggeringElement: any;
  component: ComponentType<any> | TemplateRef<any>;
}

export interface PopupDialogData {
  config: PopupDialogConfig;
  data: any;
}

interface OutOfViewport {
  top: boolean;
  topIfScaleToTop: boolean;
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
  dialogResult: any;
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
    this.direction = data.config.direction || getComputedStyle(this.config.triggeringElement).direction as ('ltr' | 'rtl')
  }

  scrollBoundedFunction = this.onScroll.bind(this);

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
    if (container === event.target || this.childOf(event.target, container)) {
      return;
    }
    if (this.config.suppressCloseOnClickSelectors) {
      for (let i = 0; i < this.config.suppressCloseOnClickSelectors.length; i++) {
        const selector = this.config.suppressCloseOnClickSelectors[i];
        const elements = document.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
          const elem = elements[i];
          if (elem === event.target || this.childOf(event.target, elem)) {
            return;
          }
        }
      }
    }

    this.closeDialog();
  }

  ngOnInit() {
    this.registerOrUnregisterAncestrosScrollEvent();
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

  ngOnDestroy() {
    this.registerOrUnregisterAncestrosScrollEvent(false);
  }

  loadComponent() {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.config.component as Type<any>);

    this.popupContentViewContainer.clear();

    const injector = ReflectiveInjector.resolveAndCreate([
      {
        provide: MAT_DIALOG_DATA,
        useValue: this.data || {}
      },
      {
        provide: POPUP_DIALOG_CLOSE,
        useValue: this.closeDialog.bind(this)
      }
    ]);
    let componentRef = this.popupContentViewContainer.createComponent(componentFactory, 0, injector);
  }

  containerTransitionEnd(event: Event) {
    if (event.target == this.dialogContainerRef.nativeElement && !this.visible) {
      this.dialogRef.close(this.dialogResult);
    }
  }

  closeDialog(dialogResult?: any) {
    this.dialogResult = dialogResult;
    this.visible = false;
  }

  private registerOrUnregisterAncestrosScrollEvent(register = true) {
    let elem = (this.config.triggeringElement as Node).parentNode;
    while (elem !== null) {
      register ?
        elem.addEventListener("scroll", this.scrollBoundedFunction) :
        elem.removeEventListener("scroll", this.scrollBoundedFunction);
      elem = elem.parentNode;
    }
  }

  private positionDialogWhereTriggeringElement() {
    const matDialogConfig: MatDialogConfig = new MatDialogConfig();
    const rect = this.config.triggeringElement.getBoundingClientRect();
    let top = this.config.coverTriggeringElement ?
      rect.bottom - this.config.triggeringElement.offsetHeight - 1 :
      rect.bottom

    matDialogConfig.position = { top: `${top}px` };
    if (this.direction == 'rtl') {
      let right = window.innerWidth - rect.left - this.config.triggeringElement.offsetWidth;
      matDialogConfig.position.right = `${right}px`;
    } else {
      matDialogConfig.position.left = `${rect.left}px`;
    }

    this.dialogRef.updatePosition(matDialogConfig.position);
  }

  private positionDialogUpIfBottomOutsideViewport() {
    if (!this.config.scaleToTopOnBottomOverflow) return;

    let dialogContainerElem = this.dialogContainerRef.nativeElement as HTMLElement;
    let result = this.isOutOfViewport();

    if (result.bottom && !result.topIfScaleToTop) {
      this.scaleBottomToTop = true;
      const matDialogConfig: MatDialogConfig = new MatDialogConfig();
      const rect = dialogContainerElem.getBoundingClientRect();
      let triggeringElementHeight = this.config.triggeringElement.offsetHeight;
      let top = this.config.coverTriggeringElement ?
        rect.top - dialogContainerElem.offsetHeight + triggeringElementHeight + 1 :
        rect.top - dialogContainerElem.offsetHeight - triggeringElementHeight

      matDialogConfig.position = { top: `${top}px` };
      if (this.direction == 'rtl') {
        let right = window.innerWidth - rect.left - this.config.triggeringElement.offsetWidth;
        matDialogConfig.position.right = `${right}px`;
      } else {
        matDialogConfig.position.left = `${rect.left}px`;
      }

      this.dialogRef.updatePosition(matDialogConfig.position);
    } else {
      this.scaleBottomToTop = false;
    }
  }

  private isOutOfViewport(): OutOfViewport {
    let container = this.dialogContainerRef.nativeElement;
    let triggeringElement = this.config.triggeringElement;
    // Get element's bounding
    var bounding = container.getBoundingClientRect();

    // reduce height from top position if scale to top
    let top = bounding.top;
    if (this.scaleBottomToTop) {
      top = this.config.coverTriggeringElement ?
        bounding.top - container.offsetHeight + triggeringElement.offsetHeight :
        bounding.top - container.offsetHeight - triggeringElement.offsetHeight
    }

    let topIfScaleToTop = top;
    if (!this.scaleBottomToTop) {
      topIfScaleToTop = top - (this.config.coverTriggeringElement ? container.offsetHeight - triggeringElement.offsetHeight : container.offsetHeight + triggeringElement.offsetHeight);
    }

    var out: any = {};
    out.top = top < 0;
    out.topIfScaleToTop = topIfScaleToTop < 0;
    out.left = bounding.left < 0;
    out.bottom = (bounding.top + container.offsetHeight) > (window.innerHeight || document.documentElement.offsetHeight);
    if (this.scaleBottomToTop && !out.bottom) {
      if (!out.top) out.bottom = true;
    }
    out.right = (bounding.left + container.offsetWidth) > (window.innerWidth || document.documentElement.offsetWidth);
    out.any = out.top || out.left || out.bottom || out.right;
    out.all = out.top && out.left && out.bottom && out.right;

    return out;
  };

  private childOf(node, ancestor) {
    var child = node;
    while (child !== null) {
      if (child === ancestor) return true;
      child = child.parentNode;
    }
    return false;
  }

}
