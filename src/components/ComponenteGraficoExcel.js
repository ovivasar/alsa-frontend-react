import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';

function ComponenteGraficoExcel({ data, columnNames }) {
  const chartRef = useRef(null); // Referencia al elemento del gráfico

  useEffect(() => {
    if (chartRef.current) {
      // Destruir el gráfico existente si ya existe uno
      chartRef.current.destroy();
    }

    const labels = data.map(item => item.descripcion);
    const datasets = columnNames.map(columnName => ({
      label: columnName,
      data: data.map(item => item[columnName]),
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    }));

    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [data, columnNames]);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data, { header: columnNames });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const blob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'datos.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <canvas id="myChart" width="400" height="400"></canvas>
      
    </div>
  );
}

export default ComponenteGraficoExcel;
