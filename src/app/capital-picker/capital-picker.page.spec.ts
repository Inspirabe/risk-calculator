import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapitalPickerPage } from './capital-picker.page';

describe('CapitalPickerPage', () => {
  let component: CapitalPickerPage;
  let fixture: ComponentFixture<CapitalPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CapitalPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
