import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDialogPageComponent } from './app-dialog-page.component';

describe('AppDialogPageComponent', () => {
  let component: AppDialogPageComponent;
  let fixture: ComponentFixture<AppDialogPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppDialogPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDialogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
