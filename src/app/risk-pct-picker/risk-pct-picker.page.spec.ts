import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskPctPickerPage } from './risk-pct-picker.page';

describe('RiskPctPickerPage', () => {
  let component: RiskPctPickerPage;
  let fixture: ComponentFixture<RiskPctPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskPctPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
