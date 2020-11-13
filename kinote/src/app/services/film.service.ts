import { Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { catchError, map, filter } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseUrl, imdbAPIUrl, rapidApiKey } from '../shared/baseurl';
import { Planned } from '../shared/planned';
import { Movie } from '../shared/movie';
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
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }


  searchShow(title: string): Observable<Movie[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': rapidApiKey
      })
    };
    return this.http.get<any>(imdbAPIUrl + 'title/find?q=' + title, httpOptions)    
    .pipe(map(res => res.results))
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getShowDetails(id: string): Observable<Movie> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': rapidApiKey
      })
    };
    console.log(id);
    return this.http.get<any>(imdbAPIUrl + 'title/get-details?tconst=' + id, httpOptions)    
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getShowDirector(id: string): Observable<Movie> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': rapidApiKey
      })
    };
    console.log(id);
    return this.http.get<any>(imdbAPIUrl + 'title/get-top-crew?tconst=' + id, httpOptions)
    .pipe(map(res => res.directors.map(director => director.name).join(', ')))
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

}
