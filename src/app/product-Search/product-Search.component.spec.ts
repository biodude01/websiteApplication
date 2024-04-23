import { ComponentFixture, TestBed } from '@angular/core/testing';

import { productSearchComponent } from './product-Search.component';

describe('SearchBarComponent', () => {
  let component: productSearchComponent;
  let fixture: ComponentFixture<productSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [productSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(productSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
