import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeatTicketComponent } from './seat-ticket.component';

describe('SeatTicketComponent', () => {
  let component: SeatTicketComponent;
  let fixture: ComponentFixture<SeatTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeatTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeatTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
