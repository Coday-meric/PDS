import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-confirm-ras',
  templateUrl: './modal-confirm-ras.component.html',
  styleUrls: ['./modal-confirm-ras.component.css']
})
export class ModalConfirmRasComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalConfirmRasComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
