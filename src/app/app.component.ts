import { Component, OnInit } from '@angular/core';
import { ApiService, GithubRepo } from './services/api.service';
import { forkJoin, map } from 'rxjs';

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

  constructor(private apiService: ApiService) {}

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
        this.loadReposAndTopics();
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  private loadReposAndTopics(): void {
    this.apiService.getRepos(this.username).subscribe({
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
