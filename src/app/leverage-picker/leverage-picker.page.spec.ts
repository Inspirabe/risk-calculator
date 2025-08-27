import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeveragePickerPage } from './leverage-picker.page';

describe('LeveragePickerPage', () => {
  let component: LeveragePickerPage;
  let fixture: ComponentFixture<LeveragePickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LeveragePickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
