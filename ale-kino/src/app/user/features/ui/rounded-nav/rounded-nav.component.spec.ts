import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundedNavComponent } from './rounded-nav.component';

describe('RoundedNavComponent', () => {
  let component: RoundedNavComponent;
  let fixture: ComponentFixture<RoundedNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundedNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundedNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
