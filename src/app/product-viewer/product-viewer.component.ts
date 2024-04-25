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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-viewer',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './product-viewer.component.html',
  styleUrl: './product-viewer.component.css'
})
export class ProductViewerComponent {
  chart: any;
  productAnalysis: any = {};
  productID: any;
  storeName: any;
  productData: any;
  userLists: any;

  constructor(public webService: WebService, public router: Router, private route: ActivatedRoute) {

  }

  ngOnInit()  {

    this.productID = this.route.snapshot.paramMap.get('id');
    this.storeName = this.route.snapshot.paramMap.get('store');
    console.log(this.productID);

    let url = this.storeName + '=' + this.productID;
  
    this.webService.productAnalysis(url).subscribe((data) => {
      console.log('Analysis results:', data);
      console.log('Analysis results:', data[0]['missingIngredients']);
      this.productAnalysis = data[0];
      console.log(this.productAnalysis)
      this.productData = this.productAnalysis['product']
      console.log(this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice'])

      //The following is a simple price data cleanup. Could be applied to the data directly
      if (/^\d{1,2}p$/.test(this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice'])) { //checks for 2 digit numbers with p symbols
          
        let digits = this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice'].match(/\d+/)[0]; // Add 0. before the digits for calculations.
        this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice'] = '0.' + digits;
        console.log("cost:", this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice']);

    }
    else{
      //this is for prices not suspected of being penny sums, however there is need to ensure they have .00 figures at the end.
      this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice'] = parseFloat(this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice'].match(/\d+(\.\d+)?/g)).toFixed(2)
      console.log("cost:", this.productData['historicalData'][this.productData['historicalData'].length - 1]['productPrice']); 
    }

      },
    (error) => {
      console.error('Error occured: ', error);
    })
    const form = new FormData();
    let check = String(localStorage.getItem('x-access-token'));
    form.append('x-access-token', check);

    this.webService.retrieveUserLists(form).subscribe((data) => {
      console.log('Search results:', data);
      this.userLists = data;
    },
    (error) => {
      console.error('Error occured: ', error);
    });
  
    }
  

  goBack(){

    history.back();

  }

  addToList(){


  }

  addToNewList(){
    
  }


}