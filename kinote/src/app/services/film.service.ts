import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl } from '../shared/baseurl';
import { Planned } from '../shared/planned';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FilmService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) { }

  submitPlan(plan: Planned): Observable<Planned> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',        
      })
    };
    return this.http.post<Planned>(baseUrl + 'planned', plan, httpOptions)
    .pipe(catchError(this.processHTTPMsgService.handleError));  }
}
