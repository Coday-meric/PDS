import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddEnqComponent } from './modal-add-enq.component';

describe('ModalAddEnqComponent', () => {
  let component: ModalAddEnqComponent;
  let fixture: ComponentFixture<ModalAddEnqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddEnqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddEnqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
