import { Component, effect, input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'altimeter-chart',
  imports: [BaseChartDirective],
  templateUrl: './AltimeterChart.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AltimeterChart {


  data = input<number[]>([]);
  labels = input<number[]>([]);

  public lineChartData!: ChartConfiguration['data'];




  constructor() {
    this.lineChartData =
    {
      datasets: [
        {
          data: this.data(),
          label: 'Altitude',
          backgroundColor: 'rgba(148,159,177,0.2)',
          borderColor: 'rgba(148,159,177,1)',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(148,159,177,0.8)',
          fill: 'origin',
        }
      ],
      labels: this.labels(),
    }

    effect(() => {
      this.lineChartData.datasets[0].data = this.data();
      this.lineChartData.labels = this.labels();

      if (this.chart) {
        this.chart.update()
      }

    })
  }



  public lineChartOptions: any = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    plugins: {
      legend: { display: true },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'x',
            value: 'March',
            borderColor: 'orange',
            borderWidth: 2,
            label: {
              display: true,
              position: 'center',
              color: 'orange',
              content: 'LineAnno',
              font: {
                weight: 'bold',
              },
            },
          },
        ],
      },
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;




}
