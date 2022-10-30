import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../data.service";

@Component({
  selector: 'app-modal-add-enq',
  templateUrl: './modal-add-enq.component.html',
  styleUrls: ['./modal-add-enq.component.css']
})
export class ModalAddEnqComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalAddEnqComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
