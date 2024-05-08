import { Component } from '@angular/core';
import { Injectable, OnInit } from '@angular/core';
import { WebService } from '../web.service';
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})


export class RegisterComponent {

  registerData: any;


  registerFormData = {
    username : '',
    password : '',
    email : ''
  };



  constructor(public webService: WebService, private router: Router) {
  
}

async onRegisterSubmit(){
  console.log(this.registerFormData)
  const warning = document.getElementsByClassName('registerWarning').item(0) as HTMLElement; 
  if (this.registerFormData["username"] == ""){
    warning.innerText = "Username required for registration"
    warning.style.display = "block"
    return
  }
  if (this.registerFormData["password"] == ""){
    warning.innerText = "password required for registration"
    warning.style.display = "block"
    return
  }
  if (this.registerFormData["email"] == ""){
    warning.innerText = "email required for registration"
    warning.style.display = "block"
    return
  }

  if (!/(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-zA-Z]).{6,}/.test(this.registerFormData['password'])){
    console.log('Password must contain an uppercase letter, at least two numbers, and be at least 6 characters long.');
    warning.innerText = "password must contain an uppercase letter, at least two numbers, and be at least 6 characters long"
    warning.style.display = 'block'; 
    return;

  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerFormData['email'])){
    console.log('email must be of a valid email format');
    warning.innerText = "email must be of a valid email format e.g something@example.com"
    warning.style.display = 'block'; 
    return;

  }

  
    warning.style.display = "none"

  const form = new FormData();
  form.append('username', this.registerFormData['username']);
  form.append('password', this.registerFormData['password']);
  form.append('email', this.registerFormData['email'])
  this.registerData = this.webService.register(form).subscribe((data) => {

  if (data[1] == '401'){
    warning.innerText = "Error: required data not supplied"
    warning.style.display = 'block'; 
    return;

  }
  if (data[1] =='409'){
    warning.innerText = "Error: user of email or username already exists"
    warning.style.display = 'block'; 
    return;

  }
  
    warning.style.color = "green";
    warning.innerText = "Registration Successful";
    warning.style.display = 'block'; 
    this.router.navigate(['/login']);
  
    return;

  })
}

}
