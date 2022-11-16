import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {DataService, EnqData, RdvData} from "../data.service";
import * as XLSX from 'xlsx-js-style';
import {DateTime} from "luxon";

export interface ExcelData {
  sct: number;
  nbr_enq: number;
  num_enq: any[];
  enq: any[];
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
  W: number = DateTime.now().weekNumber;

  enqData: Array<EnqData> = [];
  rdvData: Array<RdvData> = [];
  excelData: Array<ExcelData> = [];

  extract_date: string | undefined;

  data: any;
  maxDate = new Date(this.Y, this.M, this.D);

  nbrEnqWData: any;
  nbrEnqDData: any;


  nbrEnqD: number | undefined;
  nbrEnqW: number | undefined;
  nbrRDVD: number | undefined;

  constructor(private datePipe: DatePipe, private dataSrv: DataService) {
  }

  ngOnInit(): void {

    this.loadStats()

  }

  //TODO : Ne pas compter les RAS dans les stats
  async loadStats() {
    await this.dataSrv.getEnqWithWeekNbr(this.W, this.Y)
      .toPromise()
      .then(res => {
        this.nbrEnqWData = res!;
        console.log('Load', this.enqData)
      })
      .catch(err => {
        console.log('erreur')
      });
    await this.dataSrv.getAllEnq()
      .toPromise()
      .then(res => {
        this.nbrEnqDData = res!;
        console.log('Load', this.enqData)
      })
      .catch(err => {
        console.log('erreur')
      });

    this.nbrEnqW = this.nbrEnqWData.length
    this.nbrEnqD = this.nbrEnqDData.length
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 1;
  };

  async loadData(week: number) {
    console.log("Data")
    await this.dataSrv.getEnqWithWeekNbr(week, this.Y)
      .toPromise()
      .then(res => {
        this.enqData = res!;
        console.log('Load', this.enqData)
      })
      .catch(err => {
        console.log('erreur')
      });

    await this.dataSrv.getRdvWithWeekNbr(week, this.Y)
      .toPromise()
      .then(res => {
        this.rdvData = res!;
        console.log('Load', this.rdvData)
      })
      .catch(err => {
        console.log('erreur')
      });
  }

  dateToDay(base_date: string) {
    //convert date to US format
    let date_convert = base_date.split("-");
    let date_format = date_convert[2] + '-' + date_convert[1] + '-' + date_convert[0];
    let format = new Date(date_format)
    return format.getDay();
  }


  async extract(week: number) {
    console.log("Dedant");
    await this.loadData(week)

    console.log("Var enq", this.enqData)
    console.log("Var rdv", this.rdvData)

    let name = "PDS S" + week + ".xlsx";

    const Heading = [
      [{v: "SECTEURS", t: "s", s: {alignment: {vertical: "center", horizontal: "center"}}}, {
        v: "Enquêteurs",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }, {
        v: "Mardi",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }, {
        v: "Mercredi",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }, {
        v: "Jeudi",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }, {
        v: "Vendredi",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }, {
        v: "Samedi",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }, {
        v: "RDV SEMAINE A VENIR",
        t: "s",
        s: {alignment: {vertical: "center", horizontal: "center"}, border: {bottom: {style: "medium"}}}
      }]
    ];

    const Secteur = [102, 103, 107, 108, 114, 115, 116, 117, 118, 119, 120, 130, 131, 132, 212, 213, 214, 216, 222, 228, 101, 104, 105, 106, 109, 110, 111, 112, 113, 121, 122, 123, 124, 125, 126, 208, 219, 220, 221, 127, 128, 129, 211, 215, 217, 218, 224, 225, 226, 227, 229, 230, 231, 306, 307, 308, 309, 310, 311, 401, 410, 411, 412, 413, 201, 202, 203, 204, 205, 206, 207, 209, 210, 223, 301, 302, 303, 304, 305, 312, 402, 403, 404, 405, 406, 407, 408, 409, 501, 502, 503, 504]
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

          // Determine l'index du secteur
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
            this.excelData.push({num_enq: [], sct: enq.sct, nbr_enq: 0, enq: [["enq", enq.num_enq, enq.date_pds]]})
            // @ts-ignore
            console.log(this.excelData)
          } else {
            // @ts-ignore
            this.excelData[index].enq.push(["enq", enq.num_enq, enq.date_pds])
          }
        }
      }

    }

    // TODO: optimiser a faisant secteur et rdv en meme temps
    // Associer chaque secteur a ses rdv
    for (let sct of Secteur) {
      console.log("sct", sct)

      for (let rdv of this.rdvData) {
        console.log("enq", rdv)
        console.log("Enq SCT", rdv.sct)
        console.log("SCT", sct)

        if (rdv.sct == sct) {
          console.log("Entre if")
          let i = 0
          let index = -1
          console.log("excel Data", this.excelData)

          // Determine l'index du secteur
          for (let obj of this.excelData) {
            if (rdv.sct == obj.sct) {
              index = i;
              break;
            } else {
              index = -1
            }
            i = i + 1
          }

          console.log(index, 'index')
          if (index == -1) {
            this.excelData.push({
              num_enq: [],
              sct: rdv.sct,
              nbr_enq: 0,
              enq: [["rdv", rdv.num_enq, rdv.date_pds, rdv.date_rdv]]
            })
            // @ts-ignore
            console.log(this.excelData)
          } else {
            // @ts-ignore
            this.excelData[index].enq.push(["rdv", rdv.num_enq, rdv.date_pds, rdv.date_rdv])
          }
        }
      }
    }

    // Determiner le nombre d'enqueteur par secteur
    let i = 0;
    for (let obj of this.excelData) {
      let tempTab: any;
      tempTab = []
      for (let enq of obj.enq) {
        console.log(enq[1])
        tempTab.push(enq[1])
      }
      console.log(tempTab)
      let unique = tempTab.filter((z: any, w: any) => tempTab.indexOf(z) === w);
      this.excelData[i].nbr_enq = unique.length;
      this.excelData[i].num_enq = unique
      console.log(i, unique)
      i = i + 1
    }

    console.log("excel Data Final", this.excelData)

    //Creation du tableau
    let data: unknown[][] = [];
    let styleSct: [];
    styleSct = [];
    let styleRow: [{ hpt: number }];
    styleRow = [{hpt: 40}];
    let indexStart = 0
    let indexEnd = 0

    for (let sct of this.excelData) {
      console.log("FOR excel data", sct)
      console.log("USE ens: ", sct.enq)

      for (let enqArdv of sct.enq) {
        console.log("ENQ :", enqArdv)
        console.log("SCT:", sct.sct)
        let T = 0, W = 0, Th = 0, F = 0, S = 0;
        let RDV = "";
        let index = -1

        if (enqArdv[0] === "enq") {
          switch (this.dateToDay(enqArdv[2])) {
            case 2:
              T = T + 1
              break;
            case 3:
              W = W + 1
              break;
            case 4:
              Th = Th + 1
              break;
            case 5:
              F = F + 1
              break;
            case 6:
              S = S + 1
              break;
          }
        } else if (enqArdv[0] === "rdv") {
          RDV = RDV + "I(" + enqArdv[3] + ")"
        }

        console.log(data)
        let i = 0
        for (let obj of data) {
          console.log("sct :", sct.sct)
          console.log("enq :", enqArdv[1])
          // @ts-ignore
          console.log("obj sct :", obj[0]['v'])
          // @ts-ignore
          console.log("obj enq :", obj[1]['v'])
          // @ts-ignore
          if (sct.sct == obj[0]['v'] && enqArdv[1] == obj[1]['v']) {
            index = i;
            break;
          } else {
            // @ts-ignore
            if (sct.sct == obj[0]['v'] && enqArdv[1] != obj[1]['v']) {
              index = -2
            }
            // @ts-ignore
            else if (enqArdv[1] == obj[1]['v'] && sct.sct != obj[0]['v']) {
              index = -1
            }
          }
          i = i + 1
        }

        console.log(index)

        if (index == -1) {
          console.log("PUSH", indexStart, indexEnd)
          // @ts-ignore
          styleSct.push({s: {c: 0, r: indexStart}, e: {c: 0, r: indexEnd}})
          styleRow.push({hpt: 25})

          indexStart = indexEnd + 1
          indexEnd = indexStart

          console.log("push a new sct")
          data.push([{
            v: sct.sct,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}}
          }, {
            v: enqArdv[1],
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }, {
            v: T,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }, {
            v: W,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }, {
            v: Th,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }, {
            v: F,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }, {
            v: S,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }, {
            v: RDV,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}, border: {top: {style: "medium"}}}
          }])
        } else if (index == -2) {
          indexEnd = indexEnd + 1

          styleRow.push({hpt: 25})

          console.log("push a new enq")
          data.push([{v: sct.sct, t: "s", s: {alignment: {vertical: "center", horizontal: "center"}}}, {
            v: enqArdv[1],
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}}
          }, {v: T, t: "s", s: {alignment: {vertical: "center", horizontal: "center"}}}, {
            v: W,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}}
          }, {v: Th, t: "s", s: {alignment: {vertical: "center", horizontal: "center"}}}, {
            v: F,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}}
          }, {v: S, t: "s", s: {alignment: {vertical: "center", horizontal: "center"}}}, {
            v: RDV,
            t: "s",
            s: {alignment: {vertical: "center", horizontal: "center"}}
          }])
        } else {
          console.log("modifier")
          if (enqArdv[0] === "enq") {
            switch (this.dateToDay(enqArdv[2])) {
              case 2:
                // @ts-ignore
                data[index][2]['v'] = data[index][2]['v'] + 1
                break;
              case 3:
                // @ts-ignore
                data[index][3]['v'] = data[index][3]['v'] + 1
                break;
              case 4:
                // @ts-ignore
                data[index][4]['v'] = data[index][4]['v'] + 1
                break;
              case 5:
                // @ts-ignore
                data[index][5]['v'] = data[index][5]['v'] + 1
                break;
              case 6:
                // @ts-ignore
                data[index][6]['v'] = data[index][6]['v'] + 1
                break;
            }
          } else if (enqArdv[0] === "rdv") {
            // @ts-ignore
            data[index][7]['v'] = data[index][7]['v'] + "I(" + enqArdv[3] + ")"
          }
        }
      }
    }


    console.log(data)


    // @ts-ignore
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data, {origin: "A2"});
    worksheet["!merges"] = styleSct;
    worksheet['!cols'] = [{wch: 15}, {wch: 15}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 10}, {wch: 25}];
    worksheet['!rows'] = styleRow;
    console.log(styleRow)

    const book: XLSX.WorkBook = await XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, Heading);
    await XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    await XLSX.writeFile(book, name);

  }

}
