import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from  '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { RepositoryListComponent } from './repository-list/repository-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFontAwesome } from '@fortawesome/free-solid-svg-icons';


@NgModule({
  declarations: [
    AppComponent,
    //RepositoryListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
     FormsModule,
     BrowserAnimationsModule,
      MatPaginatorModule,
      FontAwesomeModule,
     
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
