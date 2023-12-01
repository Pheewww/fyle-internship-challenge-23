import { HttpClient, HttpErrorResponse, HttpParams,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  
}

@Injectable({
  providedIn: 'root' 
})
export class ApiService {


  constructor(private httpClient: HttpClient) { }


  getUser(githubUsername: string): Observable<any> {
    return this.httpClient.get(`https://api.github.com/users/${githubUsername}`)
      .pipe(
        catchError(this.handleError) 
      );
  }

   getRepos(githubUsername: string, page: number = 1, perPage: number = 10): Observable<GithubRepo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.httpClient.get<GithubRepo[]>(`https://api.github.com/users/${githubUsername}/repos`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
   
    console.error('An error occurred:', error.error.message);
  
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
