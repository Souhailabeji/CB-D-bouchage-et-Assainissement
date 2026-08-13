import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import 'firebase/compat/auth'; // Import Firebase Auth services
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '........' // Backend URL

  constructor (private http: HttpClient) {
   
  }

  login (credentials: { email?: string; password?: string; idToken?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials, {
      withCredentials: true
    })
  }

  register (credentials: {
    email?: string
    password?: string
    name?: string
    confirmPassword?: string
    phone?: string
    token?: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, credentials, {
      withCredentials: true
    })
  }

  setNewPassword (credentials: {
    verificationToken: string
    newPassword: string
    confirmPassword: string
  }): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/auth/set-new-password`,
      credentials,
      { withCredentials: true }
    )
  }
  forgetPasswors (credentials: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/forget-password`, credentials, {
      withCredentials: true
    })
  }
}
