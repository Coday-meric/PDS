import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface EnqDataLoc {
  sct_enq: number;
  nbr_enq: number;
}

@Component({
  selector: 'app-modal-add-enq',
  templateUrl: './modal-add-enq.component.html',
  styleUrls: ['./modal-add-enq.component.css']
})
export class ModalAddEnqComponent implements OnInit {

  sct_enq: number | undefined;
  nbr_enq: number | undefined;

  constructor(public dialogRef: MatDialogRef<ModalAddEnqComponent>, @Inject(MAT_DIALOG_DATA) public data: EnqDataLoc) {
    this.nbr_enq = 1
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
