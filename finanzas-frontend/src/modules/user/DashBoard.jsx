import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const DashBoard = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }
      ]
    };
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className='mt-2 ml-2 mr-2'>
      <div className='card' >
        <Card title={"Dashboard"} />
      </div>
      <div className='card color-primary m-4 flex justify-content-end '>
        <Button label='Descargar estado de cuenta' icon="pi pi-file" />
      </div>

      <div className="card color-primary m-4 flex">
        <div className='w-6'>
          <Chart title='Gastos por mes' type="bar" data={chartData} options={chartOptions} />
        </div>
        <div className='w-6'>
          <Chart title='Gastos por mes' type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="card color-primary m-4 flex">
        <div className='w-6'>
          <Chart title='Gastos por mes' type="bar" data={chartData} options={chartOptions} />
        </div>
        <div className='w-6'>
          <Chart title='Gastos por mes' type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>

    </div>

  )
}

export default DashBoard



