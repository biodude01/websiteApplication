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
  selector: 'app-product-viewer',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './product-viewer.component.html',
  styleUrl: './product-viewer.component.css'
})
export class ProductViewerComponent {
  chart: any;
  productAnalysis: any = {};

  constructor(public webService: WebService, private router: Router) {

  }


checker(list: any){ 
    for (const data of list) {
      console.log(data)
      for (const historicaldata of data['historicalData']) {
  
       const date = parseInt(historicaldata['sourceDate'].match(/\d{4}/)); //captures the year and excludes day, month and time
        console.log(date, " : " ,historicaldata['source']) //prints date and source of information
  
      if (/^\d{1,2}p$/.test(historicaldata['productPrice'])) { //checks for 2 digit numbers with p symbols
          
          let digits = historicaldata['productPrice'].match(/\d+/)[0]; // Add 0. before the digits for calculations.
          historicaldata['productPrice'] = '0.' + digits;
          console.log("cost:", historicaldata['productPrice']);
  
      }
      else{
        const price = parseFloat(historicaldata['productPrice'].match(/\d+(\.\d+)?/g)).toFixed(2)
        console.log("cost:", price); //prices not suspected of being penny sums needed to be ensure to have .00 figures at the end.
      }
        const pricesymbols = historicaldata['productPrice'].match(/[a-zA-Z]+/g);
        console.log("symbol:", pricesymbols); //kept symbols for error checks
        
        const quantityNum = parseInt(historicaldata['productQuantity'].match(/\d+/g));
        console.log("Numbers:", quantityNum);//simple number grab for product quantity
  
        const ingredients = historicaldata['productIngredients']
        console.log("ingredients: ", ingredients)
        
        const quantityVal = historicaldata['productQuantity'].match(/[a-zA-Z]+/g);
        console.log("Strings:", quantityVal);//kept symbols for error checks
        try{
        let pricePerGram = historicaldata['pricePerGram'].replace(/\s*\([^)]*\)|\s*\/[^)]*/g, "");
        pricePerGram = parseInt(pricePerGram.match(/\d+(\.\d+)?/g)); //had to seperate brackets, dividers and symbols from the actual cost.
        console.log('price per 100 grams:', pricePerGram)
        }
        catch{}
  
    }

  }
}

  ingredientDisect(product: any){

    let url = product['storeOrigin'] + '=' + product['id']
  
    this.webService.productAnalysis(url).subscribe((data) => {
      console.log('Analysis results:', data);
      console.log('Analysis results:', data[0]['missingIngredients']);
      this.productAnalysis = data[0];
      console.log(this.productAnalysis)
  
      },
    (error) => {
      console.error('Error occured: ', error);
    })
  
    }
  
}

