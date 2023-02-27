import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateScreeningComponent } from './create-screening.component';

describe('CreateScreeningComponent', () => {
  let component: CreateScreeningComponent;
  let fixture: ComponentFixture<CreateScreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateScreeningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
