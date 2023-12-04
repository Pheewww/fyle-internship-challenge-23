import { Component, OnInit } from '@angular/core';
import { ApiService, GithubRepo } from './services/api.service';
import { forkJoin, map } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faMapMarkerAlt,faLink } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  username: string = '';
  userProfile: any;
  userRepos: GithubRepo[] = [];
  loading: boolean = false;
  error: string = '';
   totalRepos: number = 0; // Total number of repositories
  currentPage: number = 1; // Current page for pagination
  pageSize: number =10; // Number of items per page

  constructor(private apiService: ApiService, library: FaIconLibrary) {
  library.addIcons(faMapMarkerAlt, faLink);
}


  ngOnInit(): void {}

  onSearch(): void {
    
    if (!this.username.trim()) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.userProfile = null;
    this.userRepos = [];

      this.apiService.getUser(this.username).subscribe({
    next: userProfile => {
      this.userProfile = userProfile;
      // Fetch the first page of repos when searching
      this.loadReposAndTopics(this.currentPage, this.pageSize);
    },
    error: err => {
      this.error = err.message;
      this.loading = false;
    }
  });

    this.apiService.getUser(this.username).subscribe({
      next: userProfile => {
        this.userProfile = userProfile;
       this.loadReposAndTopics(this.currentPage, this.pageSize); // Correct call with arguments
    },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
    this.loadReposAndTopics(this.currentPage, this.pageSize);
  }

  
  onPageChange(event: PageEvent): void {
    
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    
    this.loadReposAndTopics(this.currentPage, this.pageSize);
  }

 private loadReposAndTopics(page: number, pageSize: number): void {
    this.apiService.getRepos(this.username, page, pageSize).subscribe({
      next: userRepos => {
        this.userRepos = userRepos;

        //  NOW loading the topics for each repo
        const topicsRequests = userRepos.map(repo =>
          this.apiService.getRepositoryTopics(this.username, repo.name).pipe(
            map(topicsResponse => ({
              ...repo,
              topics: topicsResponse.names 
            }))
          )
        );

        // forkJoin to wait for all topics requests to complete
        forkJoin(topicsRequests).subscribe({
          next: reposWithTopics => {
            this.userRepos = reposWithTopics;
            this.loading = false;
          },
          error: err => {
            this.error = err.message;
            this.loading = false;
          }
        });
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}