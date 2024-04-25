import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {


  adminStatus: any;
  accountData: any;
  tokenData: any;

updateAccountForm = {
    "username": '',
    "password": '',
    "oldPassword": '',
    "email": ''
    }
  router: any;
    
    

  constructor(public webService: WebService) {  
      
  }


async ngOnInit(): Promise<void> {
const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
let check = String(localStorage.getItem('x-access-token'))
if (check == 'null'){
console.log("Missing token: user appears to not be logged in.")
warning.innerText = "You need to be logged in to see this screen"
warning.style.display = 'block'; 
const deletePage = document.getElementById('deletionZone') as HTMLElement; //deletes page from invalid users
deletePage.remove();
return
}
let form = new FormData()
form.append('x-access-token', check);
this.accountData = await this.webService.getAccountDetails(form) //gathers user info on entry to page for usage in all commands
let data = this.accountData[0]
this.accountData = data
console.log(this.accountData)
}

deleteAccount(){
  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
if (check == undefined){
  console.log("Missing token: user appears to not be logged in.")
  return
}
  form.append('x-access-token', check);
  form.append('password', this.accountData)
let accountID = String(this.accountData.accountID)
console.log(accountID)
  this.webService.deleteAccount(form, accountID);
  localStorage.clear();
}

updateEmail(){
  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
  if (check == undefined){
    console.log("Missing token: user appears to not be logged in.")
    return
  }
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  warning.style.color = "red";
  if (this.updateAccountForm['username'] == ''){
    warning.innerText = "Username required for update"
    warning.style.display = 'block'; 
    return
  }
  if (this.updateAccountForm['password'] == ''){
    warning.innerText = "password required for update"
    warning.style.display = 'block'; 
    return
  }
  if (this.updateAccountForm['email'] == ''){
    warning.innerText = "email required for update"
    warning.style.display = 'block'; 
    return
  }

    warning.style.display = 'none';
    if (!/(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{6,}/.test(this.updateAccountForm['password'])){
      console.log('Password must contain an uppercase letter, at least two numbers, and be at least 6 characters long.');
      warning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
      warning.style.display = 'block'; 
      return;
  
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.updateAccountForm['email'])){
      console.log('email must be of a valid email format');
      warning.innerText = "email must be of a valid email format e.g something@example.com"
      warning.style.display = 'block'; 
      return;
  
    }
    form.append('x-access-token', check);
    form.append('username', this.updateAccountForm['username'])
    form.append('password', this.updateAccountForm['password'])
    form.append('email', this.updateAccountForm['email'])
    let accountID = String(this.accountData.accountID)

console.log(form)
 let data = this.webService.updateAccount(form,accountID);
this.tokenData = data
 console.log(this.tokenData[0].token)
 localStorage.clear()

 localStorage.setItem('x-access-token', String(this.tokenData[0].token)) //sets new account token for further website usage
 warning.innerText = "Update successful, restarting page:"
 warning.style.display = 'block';
 warning.style.color = 'green' 


}
updatePassword(){

  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
  if (check == undefined){
    console.log("Missing token: user appears to not be logged in.")
    return
  }
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  warning.style.color = "red";
  if (this.updateAccountForm['username'] == ''){
    warning.innerText = "Username required for update"
    warning.style.display = 'block'; 
    return
  }

  warning.style.display = 'none';
  if (!/(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{6,}/.test(this.updateAccountForm['password'])){
    console.log('Password must contain an uppercase letter, at least two numbers, and be at least 6 characters long.');
    warning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
    warning.style.display = 'block'; 
    return;
  }


  
  form.append('x-access-token', check);
  form.append('oldPassword', this.updateAccountForm['oldPassword'])
  form.append('password', this.updateAccountForm['password'])
  let accountID = String(this.accountData.accountID)



  console.log(form)
  let data = this.webService.updateAccount(form,accountID);
 this.tokenData = data
  console.log(this.tokenData[0].token)
  localStorage.clear()

  localStorage.setItem('x-access-token', String(this.tokenData[0].token)) //sets new account token for further website usage
  warning.innerText = "Update successful, restarting page:"
  warning.style.display = 'block';
  warning.style.color = 'green'  
}

updateUsername(){

  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
  if (check == undefined){
    console.log("Missing token: user appears to not be logged in.")
    return
  }
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  warning.style.color = "red";
  if (this.updateAccountForm['username'] == ''){
    warning.innerText = "Username required for update"
    warning.style.display = 'block'; 
    return
  }


  form.append('x-access-token', check);
  form.append('username', this.updateAccountForm['username'])
  form.append('oldPassword', this.updateAccountForm['oldPassword'])
  let accountID = String(this.accountData.accountID)


  console.log(form)
  let data = this.webService.updateAccount(form,accountID);
 this.tokenData = data
  console.log(this.tokenData[0].token)
  localStorage.clear()

  localStorage.setItem('x-access-token', String(this.tokenData[0].token)) //sets new account token for further website usage
  warning.innerText = "Update successful, restarting page:"
  warning.style.display = 'block';
  warning.style.color = 'green' 

}

}
