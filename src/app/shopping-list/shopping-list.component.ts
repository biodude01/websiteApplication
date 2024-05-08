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
import Chart from 'chart.js/auto';
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
  itemView: any;
  pageSize: number = 8; 
  currentPage: number = 1; 
  totalPages: number = 0; 
  pagedItems: any;
  check: any;


  //Single item data


//group item data storage
builtCharts: any[] = [];
averageCosts: any[] = [];
groupedProducts: any[] = [];
MaxCosts: any[] = [];
MinCosts: any[] = [];
productAnalysisGrouping: any[] = [];
currentYearCosts: any[] = [];
earliestYearCosts: any[] = [];
inflationRates: any[] = [];
netContentGrouping: any[] = [];



updateForm = {

  'description' : '',
  'listName' : '',
  'list' : '',
  'id' : ''
}

  constructor(private webService: WebService, private router: Router, private route: ActivatedRoute) {
    this.router.config = routes;


  }
  
  async ngOnInit() {
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

    let response = await this.webService.tokenCheck(form) //removing users with expired

    if(response =='401'){
      this.webService.logout(form).then(() => {      
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
    
      })
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
  window.location.reload();


}

deleteFromList(event: Event, list: any, index: any){
  event.stopPropagation(); //Added to stop the clickable list from firing off as well.
  list['list'].splice(index, 1);
  
return
}

updateList(event: Event,list:any){
  event.stopPropagation(); //Added to stop the clickable list from firing off as well.
  const form = new FormData();

  form.append('x-access-token', this.check);

  form.append('description', this.updateForm.description);

  form.append('list', list[0]['list']);

  form.append('listName', this.updateForm.listName);

this.webService.updateUserList(list.listID, form)



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
    console.log('Search results:', this.lists);

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

onclick(items: any) {
  const itemViewer = document.getElementById('productListView') as HTMLElement; 
  itemViewer.style.display = 'block'
  const deletePage = document.getElementById('deletionZone') as HTMLElement; 
  deletePage.style.display = 'none'
  console.log(this.itemView)
  const form = new FormData();
  form.append('x-access-token', this.check);
  this.webService.retrieveListData(form ,items['listID']).subscribe((databody) => {
  this.lists = databody
  console.log('Search results:', databody);
  })


}


async generatePDF(){ //generates a user report for users capturing everything on screen.
  await new Promise(f => setTimeout(f, 5000));
  window.print();

}


analyticPage(){
  console.log('Lets see here now',this.groupedProducts)
  const analyticViewer = document.getElementById('listAnalytics') as HTMLElement; 
  analyticViewer.style.display = "block"
  const listViewer = document.getElementById('productListView') as HTMLElement; 
  listViewer.style.display = "none"

  for (let i = 0; i < this.lists[0]['list'].length; i++) {
console.log('Lets see here now',this.builtCharts[i])
  this.analyticList(this.lists[0]['list'][i])


}
console.log("group analysis check for ingredients",this.productAnalysisGrouping)
this.generatePDF()
}


async analyticList(item: any){

let chart: any;
 let productAnalysis: any;
 let productID: any;
 let storeName: any;
 let productData: any;
 let dateList = [];
 let priceList: any = [];
 let priceListSample:any;

  let url = item.storeOrigin + '=' + item.id;

  this.webService.productAnalysis(url).subscribe((data) => {
    console.log('Analysis results:', data);
    console.log('Analysis results:', data[0]['missingIngredients']);
    productAnalysis = data[0];
    this.productAnalysisGrouping.push(productAnalysis)
    console.log(productAnalysis)

    productData = productAnalysis['product']

    let index = 0;
    while (index < productData['historicalData'].length) {

    //The following is a simple price data cleanup. Could be applied to the data directly
    if (/^\d{1,2}p$/.test(productData['historicalData'][index]['productPrice'])) { //checks for 2 digit numbers with p symbols
        
      let digits =productData['historicalData'][index]['productPrice'].match(/\d+/)[0]; // Add 0. before the digits for calculations.
      productData['historicalData'][index]['productPrice'] = '0.' + digits;
      console.log("cost:", productData['historicalData'][index]['productPrice']);

  }
  else{
    //this is for prices not suspected of being penny sums, however there is need to ensure they have .00 figures at the end.
    productData['historicalData'][index]['productPrice'] = parseFloat(productData['historicalData'][index]['productPrice'].match(/\d+(\.\d+)?/g)).toFixed(2)
    console.log("cost:", productData['historicalData'][index]['productPrice']); 
  }
  this.groupedProducts.push(productData)
  priceList.push(productData['historicalData'][index]['productPrice'])
  dateList.push(productData['historicalData'][index]['sourceDate'])
  index++;

}
for (let i = 0; i < priceList.length; i++) {
  priceList[i] = parseFloat(priceList[i]);
}

//This section focuses on chart building via dates and pricing lists
const ctx = document.getElementById('lineChart') as HTMLCanvasElement;
chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: dateList,
    datasets: [{
      label: ('price data from ' + dateList[dateList.length - 1] + ' to ' + dateList[0]),
      data: priceList,
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  },
  options: {
    
  }
});

chart.update();
this.builtCharts.push(chart)

//This section focuses on manipulating and sorting net content data

const latestNetContent = parseInt(productData['historicalData'][productData['historicalData'].length - 1]['productQuantity'].match(/\d+/g));
const quantityVal = productData['historicalData'][productData['historicalData'].length - 1]['productQuantity'].match(/[a-zA-Z]+/g);
const earliestNetContent = parseInt(productData['historicalData'][0]['productQuantity'].match(/\d+/g));
console.log(latestNetContent, quantityVal, earliestNetContent)

let netContentText = (earliestNetContent - latestNetContent) + quantityVal;
this.netContentGrouping.push(netContentText)
console.log(netContentText)


//This section focuses on manipulating price data

const lowestPrice: number = Math.min(...priceList);
this.MinCosts.push(lowestPrice)
let sum: number = 0;
for (let i = 0; i < priceList.length; i++) {
sum += priceList[i];
}
const averagePrice: number = sum / priceList.length;
this.averageCosts.push(averagePrice)

const maximumPrice: number = Math.max(...priceList);
this.MaxCosts.push(maximumPrice)


const earlyYearPriceData = priceList[0];
const currentYearPriceData = priceList[priceList.length - 1];
this.earliestYearCosts.push(earlyYearPriceData)
this.currentYearCosts.push(currentYearPriceData)
const inflationRate  = (((currentYearPriceData - earlyYearPriceData) / earlyYearPriceData) * 100)
this.inflationRates.push(inflationRate)


    },
  (error) => {
    console.error('Error occured: ', error);
  });
  
 
  }


}











