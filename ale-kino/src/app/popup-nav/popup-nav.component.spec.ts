import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupNavComponent } from './popup-nav.component';

describe('PopupNavComponent', () => {
  let component: PopupNavComponent;
  let fixture: ComponentFixture<PopupNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
