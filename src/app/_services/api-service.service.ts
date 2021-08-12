import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }
  public getService(url: String, auth?: Boolean, params?: any) {
    if (auth) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token_lcpn') })
      };

      return this.http.get<any>(`${environment.apiUrl}${url}`, httpOptions);
    }
    else {
      return this.http.get<any>(`${environment.apiUrl}${url}`);
    }
  }

  public postService(url: String, auth?: Boolean, params?: any) {
    if (auth) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token_lcpn') })
      };

      return this.http.post<any>(`${environment.apiUrl}/${url}`, params, httpOptions);
    }
    else {
      return this.http.post<any>(`${environment.apiUrl}/${url}`, params);
    }
  }

  public putService(url: String, auth?: Boolean, params?: any) {
    if (auth) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token_lcpn') })
      };

      return this.http.put<any>(`${environment.apiUrl}/${url}`, params, httpOptions);
    }
    else {
      return this.http.put<any>(`${environment.apiUrl}/${url}`, params);
    }
  }

  public deleteService(url: String, auth?: Boolean, params?: any) {
    if (auth) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Authorization': localStorage.getItem('token_lcpn') })
      };

      return this.http.delete<any>(`${environment.apiUrl}/${url}`, httpOptions);
    }
    else {
      return this.http.delete<any>(`${environment.apiUrl}/${url}`);
    }
  }

}
