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

  deleteAccountForm = {
    "password": '',
    "confirmationCheck" : false,
    }

  updatePasswordForm = {
    "password": '',
    "oldPassword": '',
    }

updateEmailForm = {
      "email": '',
      "password": '',
      }

updateUsernameForm = {
        "username": '',
        "password": '',
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

let response = await this.webService.tokenCheck(form)

if(response =='401'){
  this.webService.logout(form).then(() => {      
    localStorage.clear();
    setTimeout(() => {
      window.location.reload();
    }, 2000);

  })
}

}

deleteAccount(){
  const form = new FormData();
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  let check = String(localStorage.getItem('x-access-token'))
if (check == undefined){
  console.log("Missing token: user appears to not be logged in.")
  warning.innerText = "You need to be logged in to see this screen"
  warning.style.display = 'block';  
  console.log("Missing token: user appears to not be logged in.")
  return
}
if (this.deleteAccountForm['confirmationCheck'] == false){
  console.log("Deletion validation needed")
  warning.innerText = "Account security: You need to checkmark the box in order to delete this account."
  warning.style.display = 'block';   
  return
}

  form.append('x-access-token', check);
  form.append('password', this.accountData)
let accountID = String(this.accountData.accountID)
console.log(accountID)
  this.webService.deleteAccount(form, accountID);
  localStorage.clear();
  this.router.navigate(['/productSearch']);
  return

}




updateEmail(){
  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
  if (check == undefined){
    console.log("Missing token: user appears to not be logged in.")
    return
  }
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  const emailWarning = document.getElementsByClassName('emailWarning').item(0) as HTMLElement; //Warns user about missing data
  warning.style.color = "white";
  if (this.updateEmailForm['email'] == ''){
    warning.innerText = "email required for update"
    warning.style.display = 'block'; 
    emailWarning.innerText = "email required for update"
    emailWarning.style.display = 'block'; 
    return
  }
  if (this.updateEmailForm['password'] == ''){
    warning.innerText = "password required for update"
    warning.style.display = 'block'; 
    emailWarning.innerText = "password required for update"
    emailWarning.style.display = 'block'; 
    return
  }


    warning.style.display = 'none';
    emailWarning.style.display = 'none';
    if (!/(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{6,}/.test(this.updateEmailForm['password'])){
      console.log('Password must contain an uppercase letter, at least two numbers, and be at least 6 characters long.');
      warning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
      warning.style.display = 'block'; 
      emailWarning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
      emailWarning.style.display = 'block'; 
      return;
  
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.updateEmailForm['email'])){
      console.log('email must be of a valid email format');
      warning.innerText = "email must be of a valid email format e.g something@example.com"
      warning.style.display = 'block'; 
      emailWarning.innerText = "email must be of a valid email format e.g something@example.com"
      emailWarning.style.display = 'block'; 
      return;
  
    }
    form.append('x-access-token', check);
    form.append('oldPassword', this.updateEmailForm['password'])
    form.append('email', this.updateEmailForm['email'])
    form.append('option', "email")

    let accountID = String(this.accountData.accountID)

console.log(form)
 let data = this.webService.updateAccount(form,accountID);
this.tokenData = data

if (this.tokenData[1] == '400'){
  warning.innerText = "Incorrect password provided"
  warning.style.display = 'block'; 
  emailWarning.innerText = "Incorrect password provided"
  emailWarning.style.display = 'block'; 
  return;

}


 console.log(this.tokenData[0].token)
 localStorage.clear()

 localStorage.setItem('x-access-token', String(this.tokenData[0].token)) //sets new account token for further website usage
 warning.innerText = "Update successful, restarting page:"
 warning.style.display = 'block';
 warning.style.color = 'green' 
 emailWarning.innerText = "Update successful, restarting page:"
 emailWarning.style.display = 'block';
 emailWarning.style.color = 'green' 


}
updatePassword(){

  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
  if (check == undefined){
    console.log("Missing token: user appears to not be logged in.")
    return
  }
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  const passwordWarning = document.getElementsByClassName('passwordWarning').item(0) as HTMLElement; //Warns user about missing data

  warning.style.color = "white";
  if (this.updatePasswordForm['password'] == ''){
    warning.innerText = "password required for update"
    warning.style.display = 'block'; 
    passwordWarning.innerText = "password required for update"
    passwordWarning.style.display = 'block'; 

    return
  }

  warning.style.display = 'none';
  passwordWarning.style.display = 'none';
  if (!/(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{6,}/.test(this.updatePasswordForm['password'])){
    console.log('Password must contain an uppercase letter, at least two numbers, and be at least 6 characters long.');
    warning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
    warning.style.display = 'block';
    passwordWarning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
    passwordWarning.style.display = 'block';  
    return;
  }


  
  form.append('x-access-token', check);
  form.append('oldPassword', this.updatePasswordForm['oldPassword'])
  form.append('password', this.updatePasswordForm['password'])
  form.append('option', "password")

  let accountID = String(this.accountData.accountID)



  console.log(form)
  let data = this.webService.updateAccount(form,accountID);
 this.tokenData = data


  if (this.tokenData[1] == '400'){
    warning.innerText = "Incorrect password provided"
    warning.style.display = 'block'; 
    passwordWarning.innerText = "Incorrect password provided"
    passwordWarning.style.display = 'block'; 

    return;

  }

  console.log(this.tokenData[0].token)
  localStorage.clear()


  localStorage.setItem('x-access-token', String(this.tokenData[0].token)) //sets new account token for further website usage
  warning.innerText = "Update successful, restarting page:"
  warning.style.display = 'block';
  warning.style.color = 'green'  
  passwordWarning.innerText = "Update successful, restarting page:"
  passwordWarning.style.display = 'block';
  passwordWarning.style.color = 'green'  

}

updateUsername(){

  const form = new FormData();
  let check = String(localStorage.getItem('x-access-token'))
  if (check == undefined){
    console.log("Missing token: user appears to not be logged in.")
    return
  }
  const warning = document.getElementsByClassName('accountAlert').item(0) as HTMLElement; //Warns user about missing data
  const usernameWarning = document.getElementsByClassName('usernameWarning').item(0) as HTMLElement; //Warns user about missing data

  warning.style.color = "white";
  if (this.updateUsernameForm['username'] == ''){
    warning.innerText = "Username required for update"
    warning.style.display = 'block'; 
    usernameWarning.innerText = "Username required for update"
    usernameWarning.style.display = 'block'; 

    return
  }
  usernameWarning.style.display = 'none'; 


  form.append('x-access-token', check);
  form.append('username', this.updateUsernameForm['username'])
  form.append('oldPassword', this.updateUsernameForm['password'])
  form.append('option', "username")
  let accountID = String(this.accountData.accountID)


  console.log(form)
  let data = this.webService.updateAccount(form,accountID);
 this.tokenData = data


  if (this.tokenData[1] == '400'){
    warning.innerText = "Incorrect password provided"
    warning.style.display = 'block'; 
    usernameWarning.innerText = "Incorrect password provided"
    usernameWarning.style.display = 'block'; 

    return;

  }

  console.log(this.tokenData[0].token)
  localStorage.clear()

  localStorage.setItem('x-access-token', String(this.tokenData[0].token)) //sets new account token for further website usage
  warning.innerText = "Update successful, restarting page:"
  warning.style.display = 'block';
  warning.style.color = 'green' 
  usernameWarning.innerText = "Update successful, restarting page:"
  usernameWarning.style.display = 'block';
  usernameWarning.style.color = 'green' 

}

}
