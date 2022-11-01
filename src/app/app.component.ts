import { Component } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalLoginComponent} from "./modal-login/modal-login.component";
import {ModalAddEnqComponent} from "./modal-add-enq/modal-add-enq.component";
import {ModalAddRdvComponent} from "./modal-add-rdv/modal-add-rdv.component";
import {DatePipe} from "@angular/common";
import {DataService, EnqData, RdvData} from "./data.service";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent {

  num_enq: number;

  enqList: Array<EnqData> = [];
  rdvList: Array<RdvData> = [];

  enqListTemp: any;
  rdvListTemp: any;

  snackduration: number;


  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private datePipe: DatePipe, private dataSrv: DataService) {
    this.num_enq = 0o00;
    this.snackduration = 3000;
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
        this.loadData(result)
      });

  }

  loadData(num_enq: number){
    this.dataSrv.getEnq(num_enq)
      .subscribe((data)=>{
        this.enqList = data;
        console.log(this.enqList)
      });
    this.dataSrv.getRdv(num_enq)
      .subscribe((data)=>{
        this.rdvList = data;
        console.log(this.rdvList)
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
        this.dataSrv.postEnq(this.num_enq, result).subscribe({
          next: data => {
            this.enqListTemp = data;
            let enqId = this.enqListTemp._id
            this.enqList.push({_id: enqId, num_enq: this.num_enq, sct: result});
            this._snackBar.open("Enquete ajouté avec succée !", "OK" ,{
              duration: this.snackduration,
              panelClass: ['mat-toolbar', 'mat-primary']
            });

          },
          error: error => {
            this._snackBar.open("Une erreur c'est produite, réessayer !", "OK" ,{
              duration: this.snackduration,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      }
    });
  }

  delEnq(_id: string, i : number){
    this.dataSrv.deleteEnq(_id).subscribe({
      next: data => {
        this.enqList.splice(i, 1);
        this._snackBar.open("Enquete supprimé avec succée !", "OK" ,{
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

      },
      error: error => {
        this._snackBar.open("Une erreur c'est produite, réessayer !", "OK" ,{
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });


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

        this.dataSrv.postRdv(this.num_enq, result.sct_rdv, temp_date).subscribe({
          next: data => {
            this.rdvListTemp = data;
            let rdvId = this.rdvListTemp._id
            this.rdvList.push({_id: rdvId, num_enq: this.num_enq, sct: result.sct_rdv, date_rdv: temp_date});

            this._snackBar.open("RDV ajouté avec succée !", "OK" ,{
              duration: this.snackduration,
              panelClass: ['mat-toolbar', 'mat-primary']
            });
          },
          error: error => {
            this._snackBar.open("Une erreur c'est produite, réessayer !", "OK" ,{
              duration: this.snackduration,
              panelClass: ['mat-toolbar', 'mat-warn']
            });
          }
        });
      }
    });
  }

  delRdv(_id: string, i : number){
    this.dataSrv.deleteRdv(_id).subscribe({
      next: data => {
        this.rdvList.splice(i, 1);

        this._snackBar.open("RDV supprimé avec succée !", "OK" ,{
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

      },
      error: error => {
        this._snackBar.open("Une erreur c'est produite, réessayer !", "OK" ,{
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-warn']
        });
      }
    });
  }


}
