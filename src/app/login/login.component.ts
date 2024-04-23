import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent {

  loginData: any;

  loginFormData = {
    username : '',
    password : ''
  };


  
  constructor(public webService: WebService, private router: Router) {

    
  }
  ngOnInit() {


    }


  async onLoginSubmit() {
    const warning = document.getElementsByClassName('loginWarning').item(0) as HTMLElement; //Warns user about missing data
    warning.style.color = "red";
    if (this.loginFormData['username'] == ''){
      warning.innerText = "Username required for login"
      warning.style.display = 'block'; 
      return
    }
    if (this.loginFormData['password'] == ''){
      warning.innerText = "password required for login"
      warning.style.display = 'block'; 
      return
    }




      warning.style.display = 'none';
    


    console.log(this.loginFormData)
    const form = new FormData();
    form.append('username', this.loginFormData["username"]);
    form.append('password', this.loginFormData['password'])
    let response = await this.webService.login(form)
    this.loginData = response

    console.log('the response',this.loginData)
    localStorage.setItem('x-access-token', String(this.loginData[0].token))
   
      if (this.loginData[1] == '401'){
        warning.innerText = "Incorrect login provided"
        warning.style.display = 'block'; 
        return;

      }
      if (this.loginData[1] =='404'){
        warning.innerText = "Incorrect login provided"
        warning.style.display = 'block'; 
        return;

      }
      if (this.loginData[1] == '200'){
        warning.style.color = "green";
        warning.innerText = "Login Successful";
        warning.style.display = 'block'; 
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        this.router.navigate(['']).then(() => {      
          setTimeout(() => {
            window.location.reload();
          }, 0);})

        return;

    }

    
  }


}
