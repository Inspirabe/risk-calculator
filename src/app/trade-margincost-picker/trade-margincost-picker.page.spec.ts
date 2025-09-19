import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeMarginCostPickerPage } from './trade-margincost-picker.page';

describe('TradeMarginCostPickerPage', () => {
  let component: TradeMarginCostPickerPage;
  let fixture: ComponentFixture<TradeMarginCostPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeMarginCostPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
