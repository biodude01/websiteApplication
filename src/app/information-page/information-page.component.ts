import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-information-page',
  standalone: true,
  imports: [],
  templateUrl: './information-page.component.html',
  styleUrl: './information-page.component.css'
})
export class InformationPageComponent {

  
constructor(public webService: WebService, private router: Router, private route: ActivatedRoute) {

}
 


  
ngOnInit() {
  

  
}
  
  

}


