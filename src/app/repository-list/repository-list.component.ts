import { Component, OnInit } from '@angular/core';
import { ApiService, GithubRepo } from '../services/api.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.scss']
})
export class RepositoryListComponent implements OnInit {
  repos: GithubRepo[] = [];
  loading: boolean = false;
  totalRepos: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0; 

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
   
    this.getRepositories();
  }

  getRepositories(event?: PageEvent): void {
    this.loading = true;
    
    const pageIndex = event ? event.pageIndex : this.pageIndex;
    const pageSize = event ? event.pageSize : this.pageSize;

    
    this.pageIndex = pageIndex;

    
    this.apiService.getRepos('username', pageIndex + 1, pageSize).subscribe({
      next: (data: any) => {
        this.repos = data.items;
        this.totalRepos = data.total_count;
        this.loading = false;
      },
    error: error => {
        console.error(error);
        this.loading = false;
      }
    });

    
  }
}
