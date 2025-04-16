import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import AxiosClient from '../../config/axiosconfig/http-config';
import { AlertHelper } from '../../components/alertas/AlertHelper';
import { Divider } from 'primereact/divider';
import EstadoCuenta from './EstadoCuenta'; 


const DashBoard = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [cuentas, setCuentas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [cuentasActivas, setCuentasActivas] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('dia');
  const [filtroValor, setFiltroValor] = useState(null);
  const [filtroOpciones, setFiltroOpciones] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('bar');
  const [mostrarModalEstadoCuenta, setMostrarModalEstadoCuenta] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    actualizarFiltroOpciones();
  }, [filtroTipo, gastos]);

  useEffect(() => {
    generarGrafico();
  }, [gastos, cuentasActivas, filtroTipo, filtroValor]);

  const fetchData = async () => {
    try {
      const cuentasRes = await AxiosClient.get('finanzas/cuentas/mis-cuentas/');
      const gastosRes = await AxiosClient.get('finanzas/gastos/mis-gastos/');

      const cuentasData = cuentasRes.cuentas;
      const gastosData = gastosRes.gastos.map(gasto => ({
        ...gasto,
        monto: parseFloat(gasto.monto),
        fecha: new Date(gasto.fecha)
      }));

      setCuentas(cuentasData);
      setCuentasActivas(cuentasData.map(c => c.id));
      setGastos(gastosData);
    } catch (error) {
      AlertHelper.showAlert("Error al cargar datos del dashboard", "error");
    }
  };


  const actualizarFiltroOpciones = () => {
    let opciones = [];

    if (filtroTipo === 'dia') {
      opciones = [...new Set(gastos.map(g => g.fecha.toISOString().split('T')[0]))];
    } else if (filtroTipo === 'mes') {
      opciones = [...new Set(gastos.map(g => `${g.fecha.getFullYear()}-${String(g.fecha.getMonth() + 1).padStart(2, '0')}`))];
    } else if (filtroTipo === 'año') {
      opciones = [...new Set(gastos.map(g => g.fecha.getFullYear().toString()))];
    }

    setFiltroOpciones(opciones.sort().reverse());
    setFiltroValor('general');
  };

  const generarGrafico = () => {
    const cuentasMap = {};
    cuentas.forEach(c => (cuentasMap[c.id] = c.banco));

    const gastosFiltrados = gastos.filter(gasto => {
      if (filtroValor === 'general') return true;

  const año = gasto.fecha.getFullYear();
  const mes = String(gasto.fecha.getMonth() + 1).padStart(2, '0');
  const dia = gasto.fecha.toISOString().split('T')[0];

  if (filtroTipo === 'dia') return dia === filtroValor;
  if (filtroTipo === 'mes') return `${año}-${mes}` === filtroValor;
  if (filtroTipo === 'año') return `${año}` === filtroValor;
  return true;
    });

    const fechasUnicas = [...new Set(gastosFiltrados.map(g => {
      if (filtroTipo === 'dia') return g.fecha.toISOString().split('T')[0];
      if (filtroTipo === 'mes') return `${g.fecha.getFullYear()}-${String(g.fecha.getMonth() + 1).padStart(2, '0')}`;
      if (filtroTipo === 'año') return `${g.fecha.getFullYear()}`;
    }))].sort();

    const datasets = cuentas
      .filter(c => cuentasActivas.includes(c.id))
      .map(cuenta => {
        const dataPorFecha = fechasUnicas.map(fecha => {
          const total = gastosFiltrados
            .filter(g => {
              const idMatch = g.cuenta === cuenta.id;
              const fechaFormateada = filtroTipo === 'dia'
                ? g.fecha.toISOString().split('T')[0]
                : filtroTipo === 'mes'
                ? `${g.fecha.getFullYear()}-${String(g.fecha.getMonth() + 1).padStart(2, '0')}`
                : `${g.fecha.getFullYear()}`;
              return idMatch && fechaFormateada === fecha;
            })
            .reduce((sum, g) => sum + g.monto, 0);
          return total;
        });

        const color = getRandomColor();
        return {
          label: cuenta.banco,
          data: dataPorFecha,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1
        };
      });

    setChartData({
      labels: fechasUnicas,
      datasets
    });

    setChartOptions({
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Gastos agrupados por ' + filtroTipo }
      },
      scales: {
        y: { beginAtZero: true },
        x: { ticks: { autoSkip: false, maxRotation: 90, minRotation: 45 } }
      }
    });
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 155 + 100);
    const g = Math.floor(Math.random() * 155 + 100);
    const b = Math.floor(Math.random() * 155 + 100);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  const toggleCuenta = (id) => {
    setCuentasActivas(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const calcularTotalPorCuenta = (idCuenta) => {
    const total = gastos
      .filter(g => {
        if (!cuentasActivas.includes(idCuenta)) return false;

        const año = g.fecha.getFullYear();
        const mes = String(g.fecha.getMonth() + 1).padStart(2, '0');
        const dia = g.fecha.toISOString().split('T')[0];
        if (filtroValor === 'general') return g.cuenta === idCuenta;

        const fechaFormateada =
          filtroTipo === 'dia' ? dia :
          filtroTipo === 'mes' ? `${año}-${mes}` :
          `${año}`;
        return g.cuenta === idCuenta && fechaFormateada === filtroValor;
      })
      .reduce((sum, g) => sum + g.monto, 0);
    return total.toFixed(2);
  };

   return (
    <div className='mt-2 ml-2 mr-2'>
      <div className='card'>
        <Card title={"Dashboard de Gastos"} />
      </div>

      <div className='card color-primary m-4 flex justify-content-end'>
        <Button 
        label='Descargar estado de cuenta' 
        icon="pi pi-file" 
        onClick={() => setMostrarModalEstadoCuenta(true)}
        />
      </div>

      <div className='m-4'>
        <h5>Totales por Cuenta</h5>
        <div className='flex flex-wrap gap-4'>
          {cuentas
            .filter(c => cuentasActivas.includes(c.id))
            .map(cuenta => (
              <Card key={cuenta.id} title={cuenta.banco} className="w-15rem">
                <p><strong>Total:</strong> ${calcularTotalPorCuenta(cuenta.id)}</p>
              </Card>
            ))}
        </div>
      </div>

      <div className='card m-4'>
        <div className='mb-3'>
          <h5>Filtrar cuentas</h5>
          <div className='flex flex-wrap gap-3'>
            {cuentas.map(cuenta => (
              <div key={cuenta.id} className='flex align-items-center gap-2'>
                <Checkbox
                  inputId={cuenta.id}
                  checked={cuentasActivas.includes(cuenta.id)}
                  onChange={() => toggleCuenta(cuenta.id)}
                />
                <label htmlFor={cuenta.id}>{cuenta.banco}</label>
              </div>
            ))}
          </div>
        </div>

        <Divider />

        <div className='flex flex-wrap gap-3 mb-4 align-items-center'>
          <div className='flex flex-column'>
            <label className='mb-1'>Agrupar por</label>
            <Dropdown
              value={filtroTipo}
              options={[
                { label: 'Día', value: 'dia' },
                { label: 'Mes', value: 'mes' },
                { label: 'Año', value: 'año' }
              ]}
              onChange={(e) => setFiltroTipo(e.value)}
              placeholder="Tipo de filtro"
            />
          </div>

          <div className='flex flex-column'>
            <label className='mb-1'>Valor</label>
            <Dropdown
              value={filtroValor}
              options={[{ label: 'General', value: 'general' }, ...filtroOpciones.map(op => ({ label: op, value: op }))]}
              onChange={(e) => setFiltroValor(e.value)}
              placeholder="Seleccionar"
              disabled={filtroOpciones.length === 0}
            />
          </div>

          <div className='flex flex-column'>
            <label className='mb-1'>Tipo de gráfica</label>
            <Dropdown
              value={tipoGrafico}
              options={[
                { label: 'Barras', value: 'bar' },
                { label: 'Líneas', value: 'line' },
                { label: 'Pastel', value: 'pie' },
                { label: 'Área Polar', value: 'polarArea' },
              ]}
              onChange={(e) => setTipoGrafico(e.value)}
              placeholder="Tipo de gráfica"
            />
          </div>
        </div>

        <Chart key={tipoGrafico} type={tipoGrafico} data={chartData} options={chartOptions} />


        <EstadoCuenta 
  visible={mostrarModalEstadoCuenta} 
  onHide={() => setMostrarModalEstadoCuenta(false)} 
  cuentas={cuentas.filter(c => cuentasActivas.includes(c.id)).map(c => ({
    ...c,
    total: calcularTotalPorCuenta(c.id)
  }))}
/>
      </div>
    </div>
  );
};

export default DashBoard;
