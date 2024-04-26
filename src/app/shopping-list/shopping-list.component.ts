import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { Injectable, OnInit} from '@angular/core';
import { WebService } from '../web.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { Route } from '@angular/router';
import { routes } from '../app.routes';
import { ActivatedRoute } from '@angular/router';
declare let html2pdf: any;

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  check: any;
updateForm = {

  'description' : '',
  'listName' : '',
  'list' : '',
  'id' : ''
}

  constructor(private webService: WebService, private router: Router, private route: ActivatedRoute) {
    this.router.config = routes;


  }
  
  ngOnInit() {
    const form = new FormData();
    const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
    this.check = String(localStorage.getItem('x-access-token'));
    form.append('x-access-token', this.check);
    if (this.check == 'null'){
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
deleteList(event: Event, listID: any){
  event.stopPropagation(); //Added to stop the clickable list from firing off as well.
  const form = new FormData();
  console.log(listID)
  form.append('x-access-token', this.check);
  this.webService.deleteList(form,listID)

}

updateList(event: Event){
  event.stopPropagation(); //Added to stop the clickable list from firing off as well.
  const form = new FormData();
  form.append('x-access-token', this.check);
  

this.webService.updateUserList(this.updateForm.id, form)


}



goToUpdate(event: Event, body: any){
  event.stopPropagation(); //Added to stop the clickable list from firing off as well.
  const deletePage = document.getElementById('deletionZone') as HTMLElement; 
  deletePage.style.display = 'none'
  const updatePage = document.getElementById('updateArea') as HTMLElement;
  updatePage.style.display = 'block'

  const form = new FormData();
  form.append('x-access-token', this.check);
  this.webService.retrieveListData(form ,body).subscribe((databody) => {
    this.lists = databody
    console.log('Search results:', databody);
  })


}

goBack(){

  history.back(); //sends the user back to the previous page

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


}


generatePDF(){ //generates a user report for users capturing everything on screen.

  const currentDateTime = new Date(); //sets file names to the date and time
  const contentContainer = document.getElementById('contentZone');
  html2pdf()
  .from(contentContainer)
  .save(currentDateTime);


}



}

