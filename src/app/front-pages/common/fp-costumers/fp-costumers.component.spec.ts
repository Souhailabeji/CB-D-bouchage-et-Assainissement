import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpCostumersComponent } from './fp-costumers.component';

describe('FpCostumersComponent', () => {
  let component: FpCostumersComponent;
  let fixture: ComponentFixture<FpCostumersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpCostumersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpCostumersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
