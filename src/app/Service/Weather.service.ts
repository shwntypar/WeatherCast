import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {  

  API_URL = "http://localhost/weather-forecast/api"

  constructor(private http: HttpClient) { }

  searchByCity(inputdata: any) {
    return this.http.post(`${this.API_URL}/search-city`, inputdata);
  }
  
  searchByLocation(inputdata: any) {
    return this.http.post(`${this.API_URL}/search-location`, inputdata);
  }



}