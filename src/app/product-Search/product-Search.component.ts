import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import Chart from 'chart.js/auto';



@Component({
  selector: 'app-product-Search',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './product-Search.component.html',
  styleUrl: './product-Search.component.css'
})
export class productSearchComponent {

  constructor(public webService: WebService, private router: Router) {

  }

  asda: boolean = false;
  sainsbury: boolean = false;
  tesco: boolean = false;
  searchBody: any;
  selectedCategory: any;
  searchTerm: any;
  searchResults: any;
  pageSize: number = 8; 
  currentPage: number = 1; 
  totalPages: number = 0; 
  pagedItems: any;

  async search(query: any) {
    this.searchResults = '';
    query.preventDefault();
    console.log(query.target)
    const formData = new FormData(query.target);
    console.log(formData)
    this.searchTerm = formData.get('productName');
   this.webService.searchQuery(formData).subscribe((data) => {
      console.log('Search results:', data);
      this.searchResults = data;
      const hider = document.getElementById('searchArea') as HTMLElement; //Initially hides search related structures
      hider.style.display = 'block'; 
      },
    (error) => {
      console.error('Error occured: ', error);
    })

  }


onclick(product: any){
  const hider = document.getElementById('overlay') as HTMLElement; //Initially hides search related structures
  hider.style.display = 'block';

  const chartElement = document.getElementById('inflationChart') as HTMLCanvasElement;
  let productData = product['historicalData']



  }



}