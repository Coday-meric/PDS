import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalLoginComponent} from "./modal-login/modal-login.component";
import {ModalAddEnqComponent} from "./modal-add-enq/modal-add-enq.component";
import {ModalAddRdvComponent} from "./modal-add-rdv/modal-add-rdv.component";
import {DatePipe} from "@angular/common";
import {EnqData, RdvData} from "./data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  num_enq: number;

  enqList: Array<EnqData> = [];
  rdvList: Array<RdvData> = [];

  constructor(public dialog: MatDialog, private datePipe: DatePipe) {
    this.num_enq = 0o00;
  }

  today: number = Date.now();

  ngOnInit(): void {

      const dialogRef = this.dialog.open(ModalLoginComponent, {
        width: '250px',
        disableClose: true
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
      data: {num_enq: this.num_enq},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if(!!result){
        this.enqList.push({num_enq: this.num_enq, sct_enq: result});
        console.log(this.enqList);
      }
    });
  }

  delEnq(i : number){
    this.enqList.splice(i, 1);
  }

  addRdv(){
    const dialogRef = this.dialog.open(ModalAddRdvComponent, {
      width: '350px',
      data: {num_enq: this.num_enq},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if(!!result) {
        console.log(result)
        let format_date = this.datePipe.transform(result.date_rdv, "dd-MM-yyyy");
        //delete non null assertion error
        let temp_date = format_date!
        this.rdvList.push({num_enq: this.num_enq, sct_rdv: result.sct_rdv, date_rdv: temp_date});
        console.log(this.rdvList);
      }
    });
  }

  delRdv(i : number){
    this.rdvList.splice(i, 1);
  }

}
