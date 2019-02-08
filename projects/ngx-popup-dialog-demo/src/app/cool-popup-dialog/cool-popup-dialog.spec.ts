import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolPopupDialog } from './cool-popup-dialog';

describe('CoolPopupDialogComponent', () => {
  let component: CoolPopupDialog;
  let fixture: ComponentFixture<CoolPopupDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolPopupDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolPopupDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
