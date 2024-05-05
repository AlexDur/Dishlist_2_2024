import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezeptErstellungComponent } from './rezept-erstellung.component';

describe('RezeptErstellungComponent', () => {
  let component: RezeptErstellungComponent;
  let fixture: ComponentFixture<RezeptErstellungComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RezeptErstellungComponent]
    });
    fixture = TestBed.createComponent(RezeptErstellungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
