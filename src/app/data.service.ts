import {Injectable} from '@angular/core';


export interface DialogData {
  num_enq: number;
  sct_enq: number;
  sct_rdv: number;
  date_rdv: string;
}


@Injectable()
export class DataService {

  constructor() {}


}
