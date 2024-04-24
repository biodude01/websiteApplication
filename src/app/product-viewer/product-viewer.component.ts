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
  
      },
    (error) => {
      console.error('Error occured: ', error);
    })
  
    }
  }



