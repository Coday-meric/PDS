import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmRasComponent } from './modal-confirm-ras.component';

describe('ModalConfirmRasComponent', () => {
  let component: ModalConfirmRasComponent;
  let fixture: ComponentFixture<ModalConfirmRasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfirmRasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmRasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
