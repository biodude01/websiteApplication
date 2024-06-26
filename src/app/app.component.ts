import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { Injectable, OnInit} from '@angular/core';
import { WebService } from './web.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { routes } from './app.routes';
import { ActivatedRoute } from '@angular/router';

@Component({

  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, AppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'



})


export class AppComponent {
  title = 'websiteApplication';  

  loginCheck: boolean = false;

  loginData: any;

  activeLink: string | null = null;
  
  constructor(private webService: WebService, private router: Router, private route: ActivatedRoute) {

    this.router.config = routes;
    
  }


    async ngOnInit() {
      
      if (localStorage.getItem('x-access-token')){
        //could include a steps to reconfirm valid token.

      this.loginCheck = true;
      }

      const form = new FormData();
      let check = String(localStorage.getItem('x-access-token'))
      form.append('x-access-token', check)
      let response = await this.webService.tokenCheck(form)

      if(response =='401'){
        this.webService.logout(form).then(() => {      
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        })
    }

  }

  
  onLogout(){
  
    const form = new FormData();
    let check = String(localStorage.getItem('x-access-token'))
    form.append('x-access-token', check);
    this.webService.logout(form).then(() => {      
      localStorage.clear();
      setTimeout(() => {
        window.location.reload();
      }, 2000);


  })



  }

  activeClick(link: string) {
    this.activeLink = link;

  }




}

