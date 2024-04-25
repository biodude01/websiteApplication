import { Routes } from '@angular/router';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule} from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { productSearchComponent } from './product-Search/product-Search.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ListViewerComponent } from './list-viewer/list-viewer.component';
import { InformationPageComponent } from './information-page/information-page.component';
import { StatisticPageComponent } from './statistic-page/statistic-page.component';
import { ProductViewerComponent } from './product-viewer/product-viewer.component';



export const routes: Routes = 
[
        { path: 'shoppingList', component: ShoppingListComponent },
        { path: 'userAccount', component: UserManagementComponent },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        { path: 'productSearch', component: productSearchComponent },
        { path: 'productSearch/:store/:id', component: ProductViewerComponent },
        { path: 'shoppingList/:id', component: ListViewerComponent},
        { path: 'information', component: InformationPageComponent},
        { path: 'statistics', component: StatisticPageComponent},
        { path: '', redirectTo: 'productSearch', pathMatch: 'full'},
        { path: '**', redirectTo: 'productSearch'},
        
      ];

      @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
      })
      export class AppModule { }
      