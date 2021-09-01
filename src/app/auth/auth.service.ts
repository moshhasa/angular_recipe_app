import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  kind : string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered? : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;


  private signUpUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + environment.firebaseAPIKey;
  private signInUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + environment.firebaseAPIKey;
  
  constructor(private client: HttpClient, private router : Router) { }

  signUp(email : string, password: string )
  {
    
    return this.client
                .post<AuthResponseData>(this.signUpUrl, {email: email, password : password, returnSecureToken : true})
                .pipe(catchError(errorResponse => {
                  return this.handleError(errorResponse);
                }),
                  tap( responseData => {
                    this.handleAuthentication(
                      responseData.email,
                      responseData.localId,
                      responseData.idToken,
                       +responseData.expiresIn
                       );
                  }));
  }

  login(email : string, password: string )
  {
   return  this.client
                .post<AuthResponseData>(this.signInUrl, {email: email, password : password, returnSecureToken : true})
                .pipe(
                  catchError(this.handleError),
                  tap( responseData => 
                    this.handleAuthentication(
                      responseData.email, 
                      responseData.localId, 
                      responseData.idToken, 
                      +responseData.expiresIn
                      )
                ));
  }

  logout()
  {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
    if(this.tokenExpirationTimer)
    {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number)
  {
    this.tokenExpirationTimer = setTimeout(() => {
     this.logout();
    },  expirationDuration);
  }

  autoLogin()
  {
    const userData: {
      email : string;
      id: string;
      _token : string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if(!userData)
    {
      return;
    }

    const expirationDate = new Date(userData._tokenExpirationDate);
    const loadedUSer = new User(userData.email, userData.id, userData._token, expirationDate);
    if(loadedUSer.token)
    {
      this.user.next(loadedUSer);
      const expirationDuration  = expirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuthentication(email: string, localId: string, token: string, expiresIn: number)
  {
    const expirationDate = new Date(new Date().getTime() + expiresIn *1000)
    const user = new User( email,  localId, token, expirationDate );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse)
  {
    console.log(errorResponse);
    let errorMessage ='An error occured!';

    if(errorResponse.error && errorResponse.error.error) // very necessary check.. thire miht be a nework isue
    {
      console.log(errorResponse.error.error);
      switch(errorResponse.error.error.message) // note error response structure is firebase specific
      {
        case 'EMAIL_EXISTS':
          errorMessage = "Email already exists";
          break;
        case 'EMAIL_NOT_FOUND' :
        case 'INVALID_PASSWORD' :
          errorMessage = 'Incorrect login details';
          break;
      }
    }

    return throwError(errorMessage);
  }
}
