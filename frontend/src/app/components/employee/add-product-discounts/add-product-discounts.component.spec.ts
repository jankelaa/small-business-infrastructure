import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductDiscountsComponent } from './add-product-discounts.component';

describe('AddProductDiscountsComponent', () => {
  let component: AddProductDiscountsComponent;
  let fixture: ComponentFixture<AddProductDiscountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductDiscountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductDiscountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
