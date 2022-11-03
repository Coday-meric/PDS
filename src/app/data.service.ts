import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '../environments/environment';
import {DatePipe} from "@angular/common";

export interface EnqData {
  _id: string;
  num_enq: number;
  sct: number;
  ras: boolean;
}

export interface RdvData {
  _id: string;
  num_enq: number;
  sct: number;
  date_rdv: string;
  ras: boolean;
}

@Injectable()
export class DataService {

  enqList: EnqData[] = [];
  rdvList: RdvData[] = [];

  date_pds: string | null;


  private _addEnqUrl = environment.apiURL + '/enq';
  private _addRdvUrl = environment.apiURL + '/rdv';

  private _enqUrl = environment.apiURL + '/front/enq';
  private _rdvUrl = environment.apiURL + '/front/rdv';

  constructor(public _httpClient: HttpClient, private datePipe: DatePipe) {
    this.date_pds = this.datePipe.transform(Date.now(), "dd-MM-yyyy");

  }


  getEnq(num_enq: number) {
    return this._httpClient.get<EnqData[]>(this._enqUrl + '/' + this.date_pds + '/' + num_enq)
  }

  getAllEnq(){
    return this._httpClient.get<EnqData[]>(this._addEnqUrl)
  }

  getRdv(num_enq: number) {
    return this._httpClient.get<RdvData[]>(this._rdvUrl + '/' + this.date_pds + '/' + num_enq)
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
    const body = {num_enq: num_enq, sct: sct, date_pds: this.date_pds, ras: false};
    return this._httpClient.post<EnqData[]>(this._addEnqUrl, body)
  }

  postEnqRas(num_enq: number, ras: boolean) {
    const body = {num_enq: num_enq, date_pds: this.date_pds, ras: ras};
    return this._httpClient.post<EnqData[]>(this._addEnqUrl, body)
  }

  postRdv(num_enq: number, sct: number, date_rdv: string) {
    const body = {num_enq: num_enq, sct: sct, date_rdv: date_rdv, date_pds: this.date_pds, ras: false};
    return this._httpClient.post<RdvData[]>(this._addRdvUrl, body)
  }

  postRdvRas(num_enq: number, ras: boolean) {
    const body = {num_enq: num_enq, date_pds: this.date_pds, ras: ras};
    return this._httpClient.post<RdvData[]>(this._addRdvUrl, body)
  }


}
