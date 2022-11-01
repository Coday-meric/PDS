import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface RdvDataLoc {
  sct_rdv: number;
  date_rdv: string;
}

@Component({
  selector: 'app-modal-add-rdv',
  templateUrl: './modal-add-rdv.component.html',
  styleUrls: ['./modal-add-rdv.component.css']
})
export class ModalAddRdvComponent implements OnInit {

  sct_rdv: number | undefined;
  date_rdv: string | undefined;
  Y: number = new Date().getFullYear();
  M: number = new Date().getMonth();
  D: number = new Date().getDay();

  constructor(public dialogRef: MatDialogRef<ModalAddRdvComponent>, @Inject(MAT_DIALOG_DATA) public data: RdvDataLoc) {

  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 1;
  };

  minDate = new Date(this.Y, this.M, this.D)

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
