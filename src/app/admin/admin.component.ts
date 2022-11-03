import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {DataService} from "../data.service";
import * as XLSX from 'xlsx';

export interface ExcelData{
  sct: number;
  nbr_enq: number;
  num_enq: any;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [DataService]
})
export class AdminComponent implements OnInit {

  Y: number = new Date().getFullYear();
  M: number = new Date().getMonth();
  D: number = new Date().getDay();

  enqData: any;
  excelData: Array<ExcelData> = [];

  extract_date: string | undefined;

  constructor(private datePipe: DatePipe, private dataSrv: DataService) { }

  ngOnInit(): void {
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 1;
  };

  maxDate = new Date(this.Y, this.M, this.D);

  async loadData(){
    console.log("Data")
    await this.dataSrv.getAllEnq()
      .toPromise()
      .then(res => {
        this.enqData = res;
        console.log('Load', this.enqData)
      })
      .catch(err => {
        console.log('erreur')
      });
  }


  async extract(date: string | undefined){
    console.log("Dedant");
    await this.loadData()

    console.log("Var", this.enqData)

    let format_date = this.datePipe.transform(date, "dd-MM-yyyy");
    let temp_date = format_date!
    let name = "PDS " + temp_date + ".xlsx";

    const Heading = [
      ["SECTEURS", "Enquêteurs", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "RDV SEMAINE A VENIR"]
    ];

    const Secteur = [102, 103, 107, 108, 114, 115, 116, 117, 118, 119, 120, 130, 131];

    // Associer chaque secteur a ses enquetes
    for (let sct of Secteur) {
      console.log("sct", sct)
      for (let enq of this.enqData) {
        console.log("enq", enq)
        console.log("Enq SCT", enq.sct)
        console.log("SCT", sct)
        if (enq.sct == sct) {
          console.log("Entre if")
          let i = 0
          let index = -1
          console.log("excel Data", this.excelData)
          for (let obj of this.excelData) {
            if (enq.sct == obj.sct) {
              index = i;
              break;
            } else {
              index = -1
            }
            i = i + 1
          }
          console.log(index, 'index')
          if (index == -1) {
            this.excelData.push({sct: enq.sct, nbr_enq: 0, num_enq: [[enq.num_enq, enq.date_pds]]})
            console.log(this.excelData)
          } else {
            this.excelData[index].num_enq.push([enq.num_enq, enq.date_pds])
          }
        }
      }
    }

    // Determiner le nombre d'enqueteur par secteur
    let i = 0;
    for (let obj of this.excelData) {
      let tempTab: any;
      tempTab = []
      for (let enq of obj.num_enq) {
        console.log(enq[0])
        tempTab.push(enq[0])
      }
      console.log(tempTab)
      let unique = tempTab.filter((z: any, w: any) => tempTab.indexOf(z) === w);
      this.excelData[i].nbr_enq = unique.length;
      console.log(i, unique)
      i = i + 1
    }








    const worksheet: XLSX.WorkSheet = await XLSX.utils.json_to_sheet(this.enqData,{skipHeader:true});

    const book: XLSX.WorkBook = await XLSX.utils.book_new();
    XLSX.utils.sheet_add_json(worksheet,this.enqData,{skipHeader:true , origin: 'A2'});
    XLSX.utils.sheet_add_aoa(worksheet, Heading);
    await XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    await XLSX.writeFile(book, name);

  }

}
