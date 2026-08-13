import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FpProjectsComponent } from './fp-projects.component';

describe('FpProjectsComponent', () => {
  let component: FpProjectsComponent;
  let fixture: ComponentFixture<FpProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FpProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FpProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
