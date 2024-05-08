import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-statistic-page',
  standalone: true,
  imports: [FormsModule, CanvasJSAngularChartsModule],
  templateUrl: './statistic-page.component.html',
  styleUrl: './statistic-page.component.css'
})
export class StatisticPageComponent {
  chart: any;
  chart2: any;
  chart3: any;
  sainsburyData: any;
  asdaData: any;
  tescoData: any;

  constructor(public webService: WebService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.webService.marketData().subscribe((data) => {
      this.sainsburyData = data[0][0];
      this.tescoData = data[0][2];
      this.asdaData = data[0][1];
      console.log(this.sainsburyData)

      this.createChart();
      this.createChart2();
      this.createChart3();

    });
  }

  createChart() {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Asda", "Tesco", "Sainsbury"],
        datasets: [{
          label: "Bakery & Sweets available in these stores",
          data: [this.asdaData['BakerySnacks'], this.tescoData['BakerySnacks'], this.sainsburyData['BakerySnacks']],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {}
    });
  }

  createChart2() {
    const ctx2 = document.getElementById('barChart2') as HTMLCanvasElement;
    this.chart2 = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ["Asda", "Tesco", "Sainsbury"],
        datasets: [{
          label: "Confectionery Sweets amongst stores",
          data: [this.asdaData['ConfectionerySweets'], this.tescoData['ConfectionerySweets'], this.sainsburyData['ConfectionerySweets']],
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {}
    });
  }


createChart3() {
  const ctx3 = document.getElementById('barChart3') as HTMLCanvasElement;
  this.chart3 = new Chart(ctx3, {
    type: 'pie',
    data: {
      labels: ['ConfectionerySweets', 'BakerySnacks', 'CookingIngredients','Drinks', 'EthnicWorldFoods', 'FreeFromDietaryOptions', 'FreshChilledFoods'],
      datasets: [{
        label: "Confectionery Sweets amongst stores",
        data: [this.sainsburyData['ConfectionerySweets'], this.sainsburyData['BakerySnacks'], this.sainsburyData['CookingIngredients'], this.sainsburyData['Drinks'], this.sainsburyData['EthnicWorldFoods'], this.sainsburyData['FreeFromDietaryOptions'], this.sainsburyData['FreshChilledFoods']],
        backgroundColor: [
          'rgb(25, 9, 172)', 
          'rgb(54, 62, 235)', 
          'rgb(135, 105, 56)', 
          'rgb(205, 225, 46)', 
          'rgb(05, 265, 146)'
        ],
        borderWidth: 1
      }]
    },
    options: {}
  });
}


}
