import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../data.service";

@Component({
  selector: 'app-modal-add-rdv',
  templateUrl: './modal-add-rdv.component.html',
  styleUrls: ['./modal-add-rdv.component.css']
})
export class ModalAddRdvComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalAddRdvComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
