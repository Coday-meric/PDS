import {Injectable} from '@angular/core';


export interface EnqData {
  num_enq: number;
  sct_enq: number;
}

export interface RdvData {
  num_enq: number;
  sct_rdv: number;
  date_rdv: string;
}

@Injectable()
export class DataService {

  constructor() {}


}
