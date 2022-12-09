import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeNavComponent } from './time-nav.component';

describe('TimeNavComponent', () => {
  let component: TimeNavComponent;
  let fixture: ComponentFixture<TimeNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
