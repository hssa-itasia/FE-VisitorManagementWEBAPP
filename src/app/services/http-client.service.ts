import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  base_url = 'https://hanzappsdev.oc.holcim.net/'
  constructor(private http: HttpClient) { }

  serachMobileNo(num:any): Observable<any> {
    return this.http.get<any>(`${this.base_url}vima/entry/MobileNumberSearch/${num}`).pipe(
      catchError(this.handleError)
    );
  } 

  searchWhomToVisist(): Observable<any> {
    return this.http.get<any>(`${this.base_url}vima/entry/whomToVisit`).pipe(
      catchError(this.handleError)
    );
  } 

  regSave(data:any): Observable<any> {
    return this.http.post<any>(`${this.base_url}vima/entry/saveVisitor`,data).pipe(
      catchError(this.handleError)
    );
  } 
  checkIn(data:any): Observable<any> {
    return this.http.post<any>(`${this.base_url}vima/check/in`,data).pipe(
      catchError(this.handleError)
    );
  } 

  checkOut(data:any): Observable<any> {
    return this.http.put<any>(`${this.base_url}vima/check/out`,data).pipe(
      catchError(this.handleError)
    );
  } 

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private data: any;
  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  private visitorData: any;
  setvisitorData(visitorData: any) {
    this.visitorData = visitorData;
  }

  getvisitorData() {
    return this.visitorData;
  }
  private imageUrl: any;
  setimageUrl(imageUrl: any) {
    this.imageUrl = imageUrl;
  }

  getimageUrl() {
    return this.imageUrl;
  }
  
  private mobileNo: any;
  setmobileNo(mobileNo: any) {
    this.mobileNo = mobileNo;
  }

  getmobileNo() {
    return this.mobileNo;
  }
}
