import { Component } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType, Chart, Filler } from 'chart.js';
// Importa BarController y cualquier otro componente necesario
// Importa BarController, PieController, ArcElement, y cualquier otro componente necesario
import {
  BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, Tooltip,
  LineController, LineElement, PointElement, Title
} from 'chart.js';

// Registra los componentes necesarios
Chart.register(BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, LineController, LineElement, PointElement, Title, Tooltip, Filler);


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  datos: any = [];
  datos1: any = [];
  datos2: any = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total Reservas',
        // O asignar colores diferentes a cada barra
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)', // color rojo
          'rgba(54, 162, 235, 0.2)', // color azul
          'rgba(255, 206, 86, 0.2)', // color amarillo
          'rgba(75, 192, 192, 0.2)', // color verde
          'rgba(153, 102, 255, 0.2)', // color morado
          'rgba(255, 159, 64, 0.2)'  // color naranja
        ],
        // También puedes asignar colores a las bordas de las barras
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartType: ChartType = 'pie'; // Cambiado de 'pie' a 'doughnut'
  public pieChartLegend = true;
  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Total Pedidos',
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // color rojo
          'rgba(54, 162, 235, 0.6)', // color azul
          'rgba(255, 206, 86, 0.6)', // color amarillo
          'rgba(75, 192, 192, 0.6)', // color verde
          'rgba(153, 102, 255, 0.6)', // color morado
          'rgba(255, 159, 64, 0.6)'  // color naranja
        ]
      }
    ]
  };


  public lineChartOptions: ChartOptions = {
    responsive: true,
  };

  // Definir el tipo de gráfico como 'line'
  public lineChartType: ChartType = 'line';
  public lineChartLegend = true;
  // Asumiendo que tienes una propiedad para los datos del gráfico de línea
  public lineChartData: ChartData<'line'> = {
    labels: [], // Las etiquetas se llenarán con los id_cliente
    datasets: [
      {
        data: [], // Los datos se llenarán con total_gasto
        label: 'Gasto Total por Cliente',
        backgroundColor: 'rgba(77, 83, 96, 0.2)', // Un color de fondo
        borderColor: 'rgba(77, 83, 96, 1)', // Un color de borde
        fill: true, // Para que el área bajo la línea se rellene
      }
    ]
  };

  constructor(private servicio: DatosService) { }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.servicio.creservas().subscribe({
      next: (datos) => {
        this.datos = datos;
        this.actualizarGrafico();
      },
      error: (error) => console.error('Hubo un error al obtener los reservar:', error)
    });

    this.servicio.cmenus().subscribe({
      next: (datos1) => {
        this.datos1 = datos1;
        this.actualizarGraficoLinea();
      },
      error: (error) => console.error('Hubo un error al obtener los reservar:', error)
    });

    this.servicio.cgastos().subscribe({
      next: (datos2) => {
        this.datos2 = datos2;
        this.actualizarGraficoPedidos();
      },
      error: (error) => console.error('Hubo un error al obtener los reservar:', error)
    });

  }

  actualizarGrafico(): void {
    this.barChartData.labels = this.datos.map((d: any) => `Cliente ${d.id_cliente}`);
    this.barChartData.datasets[0].data = this.datos.map((d: any) => +d.total_reservas);
  }

  actualizarGraficoPedidos(): void {
    this.pieChartData.labels = this.datos2.map((d: any) => d.nombre);
    this.pieChartData.datasets[0].data = this.datos2.map((d: any) => +d.total_pedidos);
  }

  actualizarGraficoLinea(): void {
    this.lineChartData.labels = this.datos1.map((d: any) => `Cliente ${d.id_cliente}`);
    this.lineChartData.datasets[0].data = this.datos1.map((d: any) => d.total_gasto);
    // Aquí deberías tener alguna manera de actualizar/redibujar el gráfico, dependiendo de cómo estés manejando los gráficos en tu aplicación
  }
}
