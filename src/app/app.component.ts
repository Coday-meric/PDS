import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalLoginComponent} from "./modal-login/modal-login.component";
import {ModalAddEnqComponent} from "./modal-add-enq/modal-add-enq.component";
import {ModalAddRdvComponent} from "./modal-add-rdv/modal-add-rdv.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  num_enq: number | undefined;
  sct_enq: number | undefined;
  sct_rdv: number | undefined;
  date_rdv: string | null | undefined;

  constructor(public dialog: MatDialog, private datePipe: DatePipe) {
  }

  ngOnInit(): void {

      const dialogRef = this.dialog.open(ModalLoginComponent, {
        width: '250px',
        disableClose: true,
        data: {num_enq: this.num_enq},
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        this.num_enq = result
        console.log(result)
      });

  }

  addEnq() {
    const dialogRef = this.dialog.open(ModalAddEnqComponent, {
      width: '250px',
      data: {sct_enq: this.sct_enq},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.sct_enq = result
      console.log(this.num_enq, this.sct_enq)
    });
  }

  addRdv(){
    const dialogRef = this.dialog.open(ModalAddRdvComponent, {
      width: '350px',
      data: {sct_rdv: this.sct_rdv, date_rdv: this.date_rdv},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(!!result) {
        console.log(result)
        this.date_rdv = this.datePipe.transform(result.date_rdv, "dd-MM-yyyy");
        this.sct_rdv = result.sct_rdv;
      }
    });
  }

}
