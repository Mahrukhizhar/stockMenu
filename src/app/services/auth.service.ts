import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface MyData {
  success: boolean;
  message: string;
}

interface RegisterResponse {
  success: boolean ;
  message: string;
 }

@Injectable({
  providedIn: 'root'
})


export class AuthService {

  constructor(private http: HttpClient) { }


  public get loggedIn(): boolean {
    return (localStorage.getItem('access_token') !== null);
  }

  setAccessToken(access_token) {
    localStorage.setItem('access_token', access_token);
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  getUserDetails(username, password) {
    // post these details to API server return user info if correct
        return this.http.post<MyData>('/api/login', {
      username,
      password
    });
  }

  registerUser(username, password) {
    return this.http.post<RegisterResponse>('/api/register', {
      username, // email:email
      password
    });
  }
}
