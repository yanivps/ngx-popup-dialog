import { NgModule, ModuleWithProviders, ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core';
import { PopupDialog } from './popup-dialog/popup-dialog';
import { PopupDialogService } from './popup-dialog/popup-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PopupDialog],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule
  ],
  entryComponents: [PopupDialog],
  exports: []
})
export class NgxPopupDialogModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxPopupDialogModule,
      providers: [PopupDialogService]
    };
  }
}
