import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddRdvComponent } from './modal-add-rdv.component';

describe('ModalAddRdvComponent', () => {
  let component: ModalAddRdvComponent;
  let fixture: ComponentFixture<ModalAddRdvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAddRdvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddRdvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
