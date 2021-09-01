import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoggedInMode: boolean = true;
  isLoading:boolean = false;
  error: string = null;

  constructor(private authService: AuthService, private router : Router) { }

  ngOnInit(): void {
  }

  onHandleError()
  {
    this.error = null;
  }

  onSwitchMode()
  {
    this.isLoggedInMode = !this.isLoggedInMode;
  }

  onSubmit(loginForm : NgForm)
  {
    if(!loginForm.valid)
    {
      return;
    }
    
    this.isLoading = true;
    const email = loginForm.value.email;
    const password = loginForm.value.password;
    let authObservable : Observable<AuthResponseData>;

    if(this.isLoggedInMode)
    { 
      authObservable = this.authService.login(email, password); 
    }
    else
    {
      authObservable = this.authService.signUp(email, password);
    }
   
    authObservable.subscribe(response => {
      console.log(response);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
      
    });

    loginForm.reset();
  }
}
