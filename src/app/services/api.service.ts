import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string;
  topics?: string[];
  
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  bio: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private headers = new HttpHeaders({ 'Accept': 'application/vnd.github.v3+json' });

  constructor(private httpClient: HttpClient) { }

  getUser(githubUsername: string): Observable<GithubUser> {
    return this.httpClient.get<GithubUser>(`https://api.github.com/users/${githubUsername}`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getRepos(githubUsername: string, page: number, perPage: number): Observable<GithubRepo[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.httpClient.get<GithubRepo[]>(`https://api.github.com/users/${githubUsername}/repos`, { headers: this.headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  getRepositoryTopics(owner: string, repo: string): Observable<any> {
    const topicsHeaders = new HttpHeaders({
      'Accept': 'application/vnd.github.mercy-preview+json'
    });

    return this.httpClient.get<any>(`https://api.github.com/repos/${owner}/${repo}/topics`, { headers: topicsHeaders })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.message);
    return throwError(() => new Error('The Username Does not Exist, Try Again'));
  }
}