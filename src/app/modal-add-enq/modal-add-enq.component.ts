import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-add-enq',
  templateUrl: './modal-add-enq.component.html',
  styleUrls: ['./modal-add-enq.component.css']
})
export class ModalAddEnqComponent implements OnInit {

  sct_enq: number | undefined;

  constructor(public dialogRef: MatDialogRef<ModalAddEnqComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
