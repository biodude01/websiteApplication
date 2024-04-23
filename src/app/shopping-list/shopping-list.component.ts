import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { Injectable, OnInit} from '@angular/core';
import { WebService } from '../web.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent {

  user: any;
  lists: any;
  pageSize: number = 8; 
  currentPage: number = 1; 
  totalPages: number = 0; 
  pagedItems: any;


  constructor(public webService: WebService, private router: Router) {


  }
  
  ngOnInit() {
    const form = new FormData();
    const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
    let check = String(localStorage.getItem('x-access-token'));
    form.append('x-access-token', check);
    if (check == 'null'){
    console.log("Missing token: user appears to not be logged in.")
    warning.innerText = "You need to be logged in to see this screen"
    warning.style.display = 'block'; 
    const deletePage = document.getElementById('deletionZone') as HTMLElement; //deletes page from invalid users
    deletePage.remove();
    return
    }
    console.log(form)
    this.webService.retrieveUserLists(form).subscribe((data) => {
      console.log('Search results:', data);
      this.lists = data;
    },
    (error) => {
      console.error('Error occured: ', error);
    });


   // this.totalPages = Math.ceil(this.lists.length / this.pageSize);
   // this.updatePagedItems();

}


  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagedItems();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedItems();
    }
  }

  updatePagedItems() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedItems = this.lists(startIndex, endIndex);
  }

onclick(data: any) {
  let url = 'shoppingList/' + data
  this.router.navigate([url]);

}



}

