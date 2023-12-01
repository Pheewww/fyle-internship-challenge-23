import { Component, OnInit } from '@angular/core';
import { ApiService, GithubRepo } from './services/api.service';

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

  ngOnInit(): void {
   
  }

  onSearch(): void {
    if (!this.username) {
      return;
    }
    this.loading = true;
    this.apiService.getUser(this.username).subscribe({
      next: userProfile => {
        this.userProfile = userProfile;
        this.error = '';
        this.loadRepos(); 
      },
      error: error => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  private loadRepos(): void {
    this.apiService.getRepos(this.username).subscribe({
      next: userRepos => {
        this.userRepos = userRepos;
        this.loading = false;
      },
      error: error => {
        this.error = error;
        this.loading = false;
      }
    });
  }
}
