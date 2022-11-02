import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ModalLoginComponent} from "./modal-login/modal-login.component";
import {ModalAddEnqComponent} from "./modal-add-enq/modal-add-enq.component";
import {ModalAddRdvComponent} from "./modal-add-rdv/modal-add-rdv.component";
import {DatePipe} from "@angular/common";
import {DataService, EnqData, RdvData} from "./data.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {ModalConfirmRasComponent} from "./modal-confirm-ras/modal-confirm-ras.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent {

  num_enq: number;

  ras_enq: boolean;
  ras_rdv: boolean;

  enqList: Array<EnqData> = [];
  rdvList: Array<RdvData> = [];

  enqListTemp: any;
  rdvListTemp: any;

  snackduration: number;


  constructor(private _snackBar: MatSnackBar, public dialog: MatDialog, private datePipe: DatePipe, private dataSrv: DataService) {
    this.num_enq = 0o00;
    this.snackduration = 3000;
    this.ras_enq = false;
    this.ras_rdv = false;
  }

  today: number = Date.now();

  ngOnInit(): void {

    const dialogRef = this.dialog.open(ModalLoginComponent, {
      width: '250px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.num_enq = result
      this.loadData(result)
    });

  }

  loadData(num_enq: number) {
    this.dataSrv.getEnq(num_enq)
      .subscribe((data) => {
        this.enqList = data;
        if (this.enqList.length === 1 && this.enqList[0].ras) {
          this.ras_enq = true
        }
      });
    this.dataSrv.getRdv(num_enq)
      .subscribe((data) => {
        this.rdvList = data;
        if (this.rdvList.length === 1 && this.rdvList[0].ras) {
          this.ras_rdv = true
        }
      });
  }

  addEnq() {
    const dialogRef = this.dialog.open(ModalAddEnqComponent, {
      width: '250px',
      data: {num_enq: this.num_enq},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.dataSrv.postEnq(this.num_enq, result).subscribe({
          next: data => {
            this.enqListTemp = data;
            let enqId = this.enqListTemp._id
            this.enqList.push({_id: enqId, num_enq: this.num_enq, sct: result, ras: false});
            this._snackBar.open("Enquete ajouté avec succée !", "OK", {
              duration: this.snackduration,
              panelClass: ['mat-toolbar', 'mat-primary']
            });

          },
          error: error => {
            this.errorSnack(error);
          }
        });
      }
    });
  }

  delEnq(_id: string, i: number) {
    this.dataSrv.deleteEnq(_id).subscribe({
      next: data => {
        this.enqList.splice(i, 1);
        this._snackBar.open("Supprimé avec succès !", "OK", {
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

      },
      error: error => {
        this.errorSnack(error);
      }
    });
  }

  rasEnq() {
    const ras_enq = this.ras_enq
    if (ras_enq) {
      if (this.enqList.length === 0) {
        this.sendRasEnqData(ras_enq);
      } else {
        const dialogRef = this.dialog.open(ModalConfirmRasComponent, {
          width: '350px',
          data: {nbr: this.enqList.length, subject: "enquete"},
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // if user confirm choice then delete all entry enq and create ras entry
            this.dataSrv.deleteEnqWithDatePds(this.num_enq).subscribe({
              next: data => {
                this.enqList.length = 0;
                this._snackBar.open("Les enquetes ont etais supprimé avec succès!", "OK", {
                  duration: this.snackduration,
                  panelClass: ['mat-toolbar', 'mat-primary']
                });
                this.sendRasEnqData(ras_enq);
              },
              error: error => {
                this.errorSnack(error);
              }
            });
          } else {
            this.ras_enq = false
          }
        });
      }
    } else {
      this.delEnq(this.enqList[0]._id, 0);
    }

  }

  addRdv() {
    const dialogRef = this.dialog.open(ModalAddRdvComponent, {
      width: '350px',
      data: {num_enq: this.num_enq},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        let format_date = this.datePipe.transform(result.date_rdv, "dd-MM-yyyy");
        //delete non null assertion error
        let temp_date = format_date!

        this.dataSrv.postRdv(this.num_enq, result.sct_rdv, temp_date).subscribe({
          next: data => {
            this.rdvListTemp = data;
            let rdvId = this.rdvListTemp._id
            this.rdvList.push({
              _id: rdvId,
              num_enq: this.num_enq,
              sct: result.sct_rdv,
              date_rdv: temp_date,
              ras: false
            });

            this._snackBar.open("RDV ajouté avec succée !", "OK", {
              duration: this.snackduration,
              panelClass: ['mat-toolbar', 'mat-primary']
            });
          },
          error: error => {
            this.errorSnack(error);
          }
        });
      }
    });
  }

  delRdv(_id: string, i: number) {
    this.dataSrv.deleteRdv(_id).subscribe({
      next: data => {
        this.rdvList.splice(i, 1);
        this._snackBar.open("Supprimé avec succès !", "OK", {
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

      },
      error: error => {
        this.errorSnack(error);
      }
    });
  }

  rasRdv() {
    const ras_rdv = this.ras_rdv
    // List RDV is empty
    if (ras_rdv) {
      if (this.rdvList.length === 0) {
        // Create ras entry in database and list
        this.sendRasRdvData(ras_rdv);
      } else {
        const dialogRef = this.dialog.open(ModalConfirmRasComponent, {
          width: '350px',
          data: {nbr: this.rdvList.length, subject: "RDV"},
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // if user confirm choice then delete all entry rdv and create ras entry
            this.dataSrv.deleteRdvWithDatePds(this.num_enq).subscribe({
              next: data => {
                this.rdvList.length = 0;
                this._snackBar.open("Les RDV ont etais supprimé avec succès!", "OK", {
                  duration: this.snackduration,
                  panelClass: ['mat-toolbar', 'mat-primary']
                });
                this.sendRasRdvData(ras_rdv);
              },
              error: error => {
                this.errorSnack(error);
              }
            });
          } else {
            this.ras_rdv = false
          }
        });
      }
    } else {
      this.delRdv(this.rdvList[0]._id, 0);
    }

  }

  sendRasEnqData(ras_enq: boolean) {
    this.dataSrv.postEnqRas(this.num_enq, ras_enq).subscribe({
      next: data => {
        this.enqListTemp = data;
        let enqId = this.enqListTemp._id
        this.enqList.push({_id: enqId, sct: 0, num_enq: this.num_enq, ras: ras_enq});
        this._snackBar.open("Aucune enquete effectué confirmé !", "OK", {
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

      },
      error: error => {
        this.errorSnack(error);
      }
    });
  }

  sendRasRdvData(ras_rdv: boolean) {
    this.dataSrv.postRdvRas(this.num_enq, ras_rdv).subscribe({
      next: data => {
        this.rdvListTemp = data;
        let rdvId = this.rdvListTemp._id
        this.rdvList.push({_id: rdvId, date_rdv: "", sct: 0, num_enq: this.num_enq, ras: ras_rdv});
        this._snackBar.open("Aucun RDV pris confirmé !", "OK", {
          duration: this.snackduration,
          panelClass: ['mat-toolbar', 'mat-primary']
        });

      },
      error: error => {
        this.errorSnack(error);
      }
    });
  }

  errorSnack(error: string){
    this._snackBar.open(`Une erreur c'est produite, réessayer ! Erreur: ${error}`, "OK", {
      duration: this.snackduration,
      panelClass: ['mat-toolbar', 'mat-warn']
    });
  }

}
