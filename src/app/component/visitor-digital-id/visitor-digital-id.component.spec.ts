import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorDigitalIdComponent } from './visitor-digital-id.component';

describe('VisitorDigitalIdComponent', () => {
  let component: VisitorDigitalIdComponent;
  let fixture: ComponentFixture<VisitorDigitalIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitorDigitalIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitorDigitalIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
