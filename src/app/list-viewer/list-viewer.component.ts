import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-viewer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './list-viewer.component.html',
  styleUrl: './list-viewer.component.css'
})
export class ListViewerComponent implements OnInit {

  id: any;
  list: any;



  constructor(public webService: WebService, private router: Router, private route: ActivatedRoute) {

    
  }
  ngOnInit() {
    const form = new FormData();
    const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
    let check = String(localStorage.getItem('x-access-token'))
    if (check == 'null'){
    console.log("Missing token: user appears to not be logged in.")
    warning.innerText = "You need to be logged in to see this screen"
    warning.style.display = 'block'; 
    const deletePage = document.getElementById('deletionZone') as HTMLElement; //deletes page from invalid users
    deletePage.remove();
    return
    }

    form.append('x-access-token', check);

    this.route.params.subscribe(params => {
      this.id = params['id'];
     this.list = this.webService.retrieveListData(form ,this.id)
    });
    }






}
