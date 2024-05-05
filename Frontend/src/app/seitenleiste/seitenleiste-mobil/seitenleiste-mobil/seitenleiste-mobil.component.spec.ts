import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeitenleisteMobilComponent } from './seitenleiste-mobil.component';

describe('SeitenleisteMobilComponent', () => {
  let component: SeitenleisteMobilComponent;
  let fixture: ComponentFixture<SeitenleisteMobilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeitenleisteMobilComponent]
    });
    fixture = TestBed.createComponent(SeitenleisteMobilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
