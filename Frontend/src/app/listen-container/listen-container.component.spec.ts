import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListenContainerComponent } from './listen-container.component';

describe('ListenContainerComponent', () => {
  let component: ListenContainerComponent;
  let fixture: ComponentFixture<ListenContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListenContainerComponent]
    });
    fixture = TestBed.createComponent(ListenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
