import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDialog } from './popup-dialog';

describe('PopupDialogComponent', () => {
  let component: PopupDialog;
  let fixture: ComponentFixture<PopupDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
