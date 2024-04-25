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
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-product-viewer',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule, MatButtonModule, CanvasJSAngularChartsModule],
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
  dateList: any = [];
  priceList: any = [];
  priceListSample:any;
  productReport = {
    description : ''
  };


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

      let index = 0;
      while (index < this.productData['historicalData'].length) {

      //The following is a simple price data cleanup. Could be applied to the data directly
      if (/^\d{1,2}p$/.test(this.productData['historicalData'][index]['productPrice'])) { //checks for 2 digit numbers with p symbols
          
        let digits = this.productData['historicalData'][index]['productPrice'].match(/\d+/)[0]; // Add 0. before the digits for calculations.
        this.productData['historicalData'][index]['productPrice'] = '0.' + digits;
        console.log("cost:", this.productData['historicalData'][index]['productPrice']);

    }
    else{
      //this is for prices not suspected of being penny sums, however there is need to ensure they have .00 figures at the end.
      this.productData['historicalData'][index]['productPrice'] = parseFloat(this.productData['historicalData'][index]['productPrice'].match(/\d+(\.\d+)?/g)).toFixed(2)
      console.log("cost:", this.productData['historicalData'][index]['productPrice']); 
    }

    this.priceList.push(this.productData['historicalData'][index]['productPrice'])
    this.dateList.push(this.productData['historicalData'][index]['sourceDate'])
    index++;

  }
  for (let i = 0; i < this.priceList.length; i++) {
    this.priceList[i] = parseFloat(this.priceList[i]);
  }

  const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: this.dateList,
      datasets: [{
        label: ('price data from ' + this.dateList[this.dateList.length - 1] + ' to ' + this.dateList[0]),
        data: this.priceList,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      
    }
  });

  this.chart.update();

      },
    (error) => {
      console.error('Error occured: ', error);
    });
    
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

    console.log('Price list',this.priceList)
    console.log('datelist',this.dateList)





    console.log('chartlabel', this.chart.data.labels)
    console.log('chartdata', this.chart.data.datasets)




  }



reportProduct(){



}
  
  

  goBack(){

    history.back(); //sends the user back to the previous page

  }

  addToList(){


  }

  addToNewList(){

  }

  openListChoice(){


  }

  addListClose(){


  }

  dropListClose(){


  }


}