import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipBookComponent } from './internship-book.component';

describe('InternshipBookComponent', () => {
  let component: InternshipBookComponent;
  let fixture: ComponentFixture<InternshipBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternshipBookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternshipBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

