import { Component,  AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Chart} from 'chart.js/auto';
@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements AfterViewInit {
  @ViewChild('radar') radar:ElementRef | undefined
  radarChart: any 

  @ViewChild('polar') polar:ElementRef | undefined
  polarChart: any 

  @ViewChild('polar2') polar2:ElementRef | undefined
  polar2Chart: any 

  constructor(private router: Router) { }
  
  navegarLogin(){
    this.router.navigate(['login'])
  }

  navegarMain(){
    this.router.navigate(['main'])
  }

  ngAfterViewInit(): void {
    this.radarChartMethod()
    this.polarChartMethod()
    this.polar2ChartMethod()
  }

  radarChartMethod(): void{
    this.radarChart = new Chart(this.radar?.nativeElement,{
      type:'radar',
      data : {
        labels: [
          'Eating',
          'Drinking',
          'Sleeping',
          'Designing',
          'Coding',
          'Cycling',
          'Running'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [65, 59, 90, 81, 56, 55, 40],
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
          label: 'My Second Dataset',
          data: [28, 48, 40, 19, 96, 27, 100],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      },

    })
  }

  polarChartMethod(): void{
    this.polarChart = new Chart(this.polar?.nativeElement,{
      type:'polarArea',
      data : {
        labels: [
          'Red',
          'Green',
          'Yellow',
          'Grey',
          'Blue'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [11, 16, 7, 3, 14],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)'
          ]
        }]
      }
    })
  }

  polar2ChartMethod(): void{
    this.polar2Chart = new Chart(this.polar2?.nativeElement,{
      type:'polarArea',
      data : {
        labels: [
          'Red',
          'Green',
          'Yellow',
          'Grey',
          'Blue'
        ],
        datasets: [{
          label: 'My First Dataset',
          data: [11, 16, 7, 3, 14],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(75, 192, 192)',
            'rgb(255, 205, 86)',
            'rgb(201, 203, 207)',
            'rgb(54, 162, 235)'
          ]
        }]
      }
    })
  }
}
