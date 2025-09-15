import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SymbolPickerPage } from './symbol-picker.page';

describe('SymbolPickerPage', () => {
  let component: SymbolPickerPage;
  let fixture: ComponentFixture<SymbolPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
