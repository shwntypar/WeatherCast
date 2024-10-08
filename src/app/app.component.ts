import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { WeatherService } from './Service/Weather.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { initFlowbite } from 'flowbite';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, MatTooltipModule, MatMenuModule, MatButtonModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'web_app_weather';
  searchForm: any;
  private subscriptions = new Subscription();
  weatherData: any;
  loading: boolean = true;
  metricSystem: any = '&units=metric';
  AdvancedView: boolean = false;
  MetricSymbol: string = '';

  currLat: any;
  currLng: any;

  constructor(private builder: FormBuilder, private  weather: WeatherService){

    this.searchForm = builder.group({
      city: ['', Validators.required],
      metricSystem: this.metricSystem
    })

    const metricSystem:any = localStorage.getItem('metricSystem');
    if(metricSystem && metricSystem !== 'null'){
      this.metricSystem = metricSystem;
    }

    const showAdvancedString:any = localStorage.getItem('AdvancedView');
    if(showAdvancedString){
      this.AdvancedView = JSON.parse(showAdvancedString);
    }

  }

  ngOnInit(): void {
    this.searchByLocation();
    this.setMetricSystem(this.metricSystem);
    initFlowbite();
    
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ChangeMeasurement(metricSystem: string){
    this.loading = true;
    this.metricSystem = metricSystem;
    this.setMetricSystem(metricSystem);
    if(this.searchForm.value.city){
      this.searchByCity();
    } else{
      this.searchByLocation();
    }
    
  }

  ChangeView(){
    this.AdvancedView = !this.AdvancedView;
    const ViewString = JSON.stringify(this.AdvancedView);
    localStorage.setItem('AdvancedView', ViewString);
  }

  MetricMeasurement(metric: string){
    if(metric == '&units=metric'){
      this.MetricSymbol = 'C';
    }else if(metric == '&units=imperial'){
      this.MetricSymbol = 'F'
    }else if(metric == '&units=standard'){
      this.MetricSymbol = 'K'
    }else{
      this.MetricSymbol = ''
    }
  }

  setMetricSystem(metric: string): void {
    this.metricSystem = metric;
    this.MetricMeasurement(metric);
    localStorage.setItem('metricSystem', metric);
  }

  searchByLocation(){

    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        metricSystem: this.metricSystem,
        isLoading: this.loading
      }      
      this.subscriptions.add(
        this.weather.searchByLocation(userLocation).subscribe((res:any)=>{
          this.weatherData = res.payload;
          this.loading = false;
        })
      )
    });
  }
  
  searchByCity(){
    this.searchForm.patchValue({
      metricSystem: this.metricSystem
    })
    if(!this.searchForm.valid){
      Swal.fire({
        title: "Please enter a City",
        icon: "warning"
      })
      return
    }
    this.subscriptions.add(
      this.weather.searchByCity(this.searchForm.value).subscribe((res:any)=>{
        this.weatherData = res.payload;
        this.loading = false;
        console.log(this.weatherData);
      }, error =>{
        switch (error.status){
          case 404:
            Swal.fire({
              title: "City not found",
              text: `${error.error.status.message}`,
              icon: "warning",
              timer: 2000,
              timerProgressBar: true,
            })
          break;
          case 400:
            Swal.fire({
              title: "Invalid City",
              text: `Please enter a valid city.`,
              icon: "warning",
              timer: 2000,
              timerProgressBar: true,
            })
          break;
          default:
            Swal.fire({
              title: "Error fetching data",
              text: `${error.error.status.message}`,
              icon: "error",
              timer: 2000,
              timerProgressBar: true,
            })
        }
      })
    )
  }

  getWindDirection(deg: number): string {
    if (deg >= 0 && deg < 22.5) return 'N';
    else if (deg >= 22.5 && deg < 67.5) return 'NE';
    else if (deg >= 67.5 && deg < 112.5) return 'E';
    else if (deg >= 112.5 && deg < 157.5) return 'SE';
    else if (deg >= 157.5 && deg < 202.5) return 'S';
    else if (deg >= 202.5 && deg < 247.5) return 'SW';
    else if (deg >= 247.5 && deg < 292.5) return 'W';
    else if (deg >= 292.5 && deg < 337.5) return 'NW';
    else return 'N';
  }
  
}

  
 
