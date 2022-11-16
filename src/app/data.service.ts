import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';
import {DatePipe} from "@angular/common";
import {DateTime} from "luxon";

export interface EnqDataLocal {
  _id: string;
  num_enq: number;
  sct: number;
  ras: boolean;
}
export interface RdvDataLocal {
  _id: string;
  num_enq: number;
  sct: number;
  date_rdv: string;
  ras: boolean;
}

export interface EnqData {
  _id: string;
  num_enq: number;
  date_pds: string;
  week_pds: number;
  year_pds: number;
  sct: number;
  ras: boolean;
}

export interface RdvData {
  _id: string;
  num_enq: number;
  sct: number;
  date_rdv: string;
  date_pds: string;
  week_pds: number;
  year_pds: number;
  ras: boolean;
}





@Injectable()
export class DataService {

  enqList: EnqData[] = [];
  rdvList: RdvData[] = [];

  date_pds: string | null;
  Y: number = new Date().getFullYear();
  W: number = DateTime.now().weekNumber;


  private _addEnqUrl = environment.apiURL + '/enq';
  private _addRdvUrl = environment.apiURL + '/rdv';

  private _enqUrl = environment.apiURL + '/front/enq';
  private _enqAdminUrl = environment.apiURL + '/admin/enq';
  private _rdvUrl = environment.apiURL + '/front/rdv';
  private _rdvAdminUrl = environment.apiURL + '/admin/rdv';

  constructor(public _httpClient: HttpClient, private datePipe: DatePipe) {
    this.date_pds = this.datePipe.transform(Date.now(), "dd-MM-yyyy");

  }


  getEnq(num_enq: number) {
    return this._httpClient.get<EnqData[]>(this._enqUrl + '/' + this.date_pds + '/' + num_enq)
  }

  getEnqWithWeekNbr(week: number, year: number) {
    return this._httpClient.get<EnqData[]>(this._enqAdminUrl + '/' + week + '/' + year)
  }

  getAllEnq(){
    return this._httpClient.get<EnqData[]>(this._enqAdminUrl + '/' + this.date_pds)
  }

  getRdv(num_enq: number) {
    return this._httpClient.get<RdvData[]>(this._rdvUrl + '/' + this.date_pds + '/' + num_enq)
  }

  getRdvWithWeekNbr(week: number, year: number) {
    return this._httpClient.get<RdvData[]>(this._rdvAdminUrl + '/' + week + '/' + year)
  }

  deleteEnq(_id: string) {
    return this._httpClient.delete<EnqData[]>(this._addEnqUrl + '/' + _id)
  }

  deleteEnqWithDatePds(num_enq: number){
    return this._httpClient.delete<EnqData[]>(this._enqUrl + '/' + this.date_pds + '/' + num_enq)
  }

  deleteRdvWithDatePds(num_enq: number){
    return this._httpClient.delete<RdvData[]>(this._rdvUrl + '/' + this.date_pds + '/' + num_enq)
  }

  deleteRdv(_id: string) {
    return this._httpClient.delete<RdvData[]>(this._addRdvUrl + '/' + _id)
  }

  postEnq(num_enq: number, sct: number) {
    const body = {num_enq: num_enq, sct: sct, date_pds: this.date_pds, week_pds: this.W, year_pds: this.Y, ras: false};
    return this._httpClient.post<EnqData[]>(this._addEnqUrl, body)
  }

  postEnqRas(num_enq: number, ras: boolean) {
    const body = {num_enq: num_enq, date_pds: this.date_pds, week_pds: this.W, year_pds: this.Y, ras: ras};
    return this._httpClient.post<EnqData[]>(this._addEnqUrl, body)
  }

  postRdv(num_enq: number, sct: number, date_rdv: string) {
    const body = {num_enq: num_enq, sct: sct, date_rdv: date_rdv, date_pds: this.date_pds, week_pds: this.W, year_pds: this.Y, ras: false};
    return this._httpClient.post<RdvData[]>(this._addRdvUrl, body)
  }

  postRdvRas(num_enq: number, ras: boolean) {
    const body = {num_enq: num_enq, date_pds: this.date_pds, week_pds: this.W, year_pds: this.Y, ras: ras};
    return this._httpClient.post<RdvData[]>(this._addRdvUrl, body)
  }


}
