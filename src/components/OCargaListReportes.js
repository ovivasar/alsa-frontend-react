import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Grid, Button,useMediaQuery } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import FindIcon from '@mui/icons-material/FindInPage';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import Datatable, {createTheme} from 'react-data-table-component';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import '../App.css';
import 'styled-components';

//import { utils, writeFile } from 'xlsx';
import BotonExcelCrossTab from "./BotonExcelCrossTab";

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { useAuth0 } from '@auth0/auth0-react'; //new para cargar permisos luego de verificar registro en bd
import ComponenteGraficoExcel from './ComponenteGraficoExcel';

export default function OCargaListReportes() {
  //verificamos si es pantalla pequeña y arreglamos el grid de fechas
  const isSmallScreen = useMediaQuery('(max-width: 600px)');

  //Para recibir parametros desde afuera
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  const params = useParams();

  createTheme('solarized', {
    text: {
      //primary: '#268bd2',
      primary: '#ffffff',
      secondary: '#2aa198',
    },
    background: {
      //default: '#002b36',
      default: '#1e272e'
    },
    context: {
      background: '#cb4b16',
      //background: '#1e272e',
      text: '#FFFFFF',
    },
    divider: {
      default: '#073642',
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)',
    }
  }, 'dark');

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	
  const [registrosdet,setRegistrosdet] = useState([]); //Para vista principal
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado
  const [regdet,setRegdet] = useState({ //Para envio minimo en Ejec
    ano:'',
    numero:'',
    item:''
  })

  const [valorVista, setValorVista] = useState("pedidos");
  const {user, isAuthenticated } = useAuth0();
  
  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  

  const cargaRegistro = async () => {
    var response;
    let strFechaIni="";
    let strFecha="";
    //La data, corresponde al mes de login
    //le cargaremos fecha actual si parametro no existe
    strFechaIni=params.fecha_ini;
    //console.log("Fecha ini:",strFechaIni);

    strFecha=params.fecha_proceso;
    
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }
    
    //console.log("valor antes de cargar backend: ", valorVista);
    //al reves por mientras
    if (valorVista==="cliente"){
      response = await fetch(`${back_host}/ocargaplancrosstab2/${strFechaIni}/${strFecha}`);
    }else{
      if (valorVista==="producto"){
        response = await fetch(`${back_host}/ocargaplancrosstab3/${strFechaIni}/${strFecha}`);
      }else{
        if (valorVista==="vendedor"){
          response = await fetch(`${back_host}/ocargaplancrosstab4/${strFechaIni}/${strFecha}`);
        }
        else{
          if (valorVista==="zona"){
            response = await fetch(`${back_host}/ocargaplancrosstab5/${strFechaIni}/${strFecha}`);
          }
          else{
            //El pedidos nomas
            response = await fetch(`${back_host}/ocargaplancrosstab1/${strFechaIni}/${strFecha}`);
          }
        }
      }
    }

    const data = await response.json();
    setRegistrosdet(data);
    console.log(data.length);
    setTabladet(data); //Copia para tratamiento de filtrado
  } 
  //////////////////////////////////////
  function obtenerMesesEntreFechas(fecha1, fecha2) {
    // Extrae el año y mes de fecha1
    const [anio1, mes1] = fecha1.split('-');
  
    // Extrae el año y mes de fecha2
    const [anio2, mes2] = fecha2.split('-');
  
    // Convierte los años y meses en números
    const anioInicio = parseInt(anio1, 10);
    const anioFin = parseInt(anio2, 10);
    const mesInicio = parseInt(mes1, 10);
    const mesFin = parseInt(mes2, 10);
  
    // Arreglo para almacenar los meses
    const meses = [];
  
    // Itera desde el año y mes de inicio hasta el año y mes de fin
    for (let anio = anioInicio; anio <= anioFin; anio++) {
      // El mes inicial depende del año actual
      let mesInicioActual = mesInicio;
      if (anio === anioInicio) {
        mesInicioActual = Math.max(mesInicioActual, 1);
      }
      // El mes final depende del año actual
      let mesFinActual = mesFin;
      if (anio === anioFin) {
        mesFinActual = Math.min(mesFinActual, 12);
      }
  
      // Itera sobre los meses del año actual
      for (let mes = mesInicioActual; mes <= mesFinActual; mes++) {
        // Formatea el mes con dos dígitos (por ejemplo, '05' en lugar de '5')
        const mesFormateado = mes.toString().padStart(2, '0');
  
        // Construye el formato 'YYYY-MM' y lo agrega al arreglo de meses
        meses.push(`${anio}-${mesFormateado}`);
      }
    }
    return meses;
  }
  
  //const meses = ['2023-05', '2023-06', '2023-07', '2023-08', '2023-09'];
  const meses = obtenerMesesEntreFechas(params.fecha_ini,params.fecha_proceso);
  // Crea las columnas para los meses dinámicamente
  const columnasMeses = meses.map((mes) => ({
    name: mes, // El nombre de la columna será el nombre del mes
    selector: (row) => row[mes], // Accede a la propiedad del objeto correspondiente al mes
    sortable: true,
  }));

  const columnas = [
    {
      name: '',
      width: '40px',
      cell: (row) => (
          <SearchOutlinedIcon
            onClick={() => handleExploreClick(row.descripcion) }
            style={{
              cursor: 'pointer',
              color: 'skyblue',
              transition: 'color 0.3s ease',
            }}
          />
      ),
      allowOverflow: true,
      button: true,
    },

    { name:'DESCRIPCION', 
      selector:row => row.descripcion,
      width: '300px',      
      cell: (row) => (
        <Tooltip title={row.descripcion ? row.descripcion : ''}>
          <span>
          {row.descripcion ? row.descripcion.substring(0, 300) : ''}
          </span>
        </Tooltip>
              ),      
      sortable: true
    },
    ...columnasMeses, // Agrega las columnas de meses dinámicamente    
    { name:'TOTALES', 
      selector: (row) => parseFloat(row.total_cli), // Convierte el valor de texto a número
      width: '100px',
      sortable: true,
      cell: (row) => (
        <span>
          {parseFloat(row.total_cli).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      ),
    },

  ];
  const handleExploreClick = (descripcion) => {
    //const partes = descripcion.split("-"); // Divide la cadena en partes usando "-" como separador
    //const codigo = partes[0]; // Obtiene la primera parte que es el código
    //console.log(codigo, descripcion);
    if (valorVista==="pedidos" || valorVista==="cliente"){
      navigate(`/ocargadetreportesmas/${params.fecha_ini}/${params.fecha_proceso}/${valorVista}/${descripcion}`);
    }
  };

  const navigate = useNavigate();

  const actualizaValorFiltro = e => {
    setValorBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const actualizaValorVista = (e) => {
    setValorVista(e.target.value);
    //Lo dejaremos terminar el evento de cambio o change
    setUpdateTrigger(Math.random());//experimento para actualizar el dom
  }

  const filtrar=(strBusca)=>{
      var resultadosBusqueda = [];
      resultadosBusqueda = tabladet.filter((elemento) => {
        if (elemento.descripcion.toString().toLowerCase().includes(strBusca.toLowerCase())
//         || elemento.descripcion.toString().toLowerCase().includes(strBusca.toLowerCase())
          ){
              return elemento;
          }
      });
      setRegistrosdet(resultadosBusqueda);
  }

  const customStyles = {
    rows: {
        style: {
            minHeight: '72px', // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '0px', // override the cell padding for head cells
            paddingRight: '8px',
        },
    },
    cells: {
        style: {
            paddingLeft: '0px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
  };

  const handleExportGraficoClick = () => {
    // Llama a la función exportToExcel del componente ChartComponent
    // Pasando los datos y nombres de columnas adecuados
    ComponenteGraficoExcel.exportToExcel(registrosdet, meses);
  };  
  //////////////////////////////////////////////////////////
  useEffect( ()=> {
      console.log(columnas);
      cargaRegistro();

      //NEW codigo para autenticacion y permisos de BD
      if (isAuthenticated && user && user.email) {
        // cargar permisos de sistema
        //cargaPermisosMenuComando('02'); //Alimentamos el useState permisosComando
        //console.log(permisosComando);
      }

  },[updateTrigger, isAuthenticated, user])
  //////////////////////////////////////////////////////////

 return (
  <>
  <Grid container
        direction={isSmallScreen ? 'column' : 'row'}
        //alignItems={isSmallScreen ? 'center' : 'center'}
        justifyContent={isSmallScreen ? 'center' : 'center'}
  >
    <Grid item xs={10}>
      <TextField fullWidth variant="outlined" color="warning" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.0rem 0'}}
                                   name="busqueda"
                                   placeholder='Cliente   Producto  Vendedor   Zona'
                                   onChange={actualizaValorFiltro}
                                   inputProps={{ style:{color:'white'} }}
                                   InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <FindIcon />
                                        </InputAdornment>
                                      ),
                                      style:{color:'white'} 
                                  }}
      />
    </Grid>
    <Grid item xs={0.9}>
      {
      <BotonExcelCrossTab registrosdet={registrosdet} meses={meses} valorVista={valorVista} />
                                }
    </Grid>
    <Grid item xs={1.1}>    
      {
      <div>
      
      </div>
                                    }
    </Grid>
  </Grid>

    <div>
    <ToggleButtonGroup
      color="warning"
      value={valorVista}
      exclusive
      onChange={actualizaValorVista}
      aria-label="Platform"
    >
      <ToggleButton value="pedidos"># Pedidos</ToggleButton>
      <ToggleButton value="cliente">TN - Cliente</ToggleButton>
      <ToggleButton value="producto">TN - Producto</ToggleButton>
      <ToggleButton value="vendedor">TN - Vendedor</ToggleButton>
      <ToggleButton value="zona">TN - Zona</ToggleButton>
    </ToggleButtonGroup>      
    </div>
    
    <Datatable
      //title="Registro - OC"
      theme="solarized"
      columns={columnas}
      data={registrosdet}
      //selectableRows
      //contextActions={contextActions}
      //actions={actions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
      highlightOnHover
      pagination
      paginationPerPage={30}
      paginationRowsPerPageOptions={[30, 50, 100]}

      //selectableRowsComponent={Checkbox} // Pass the function only
      sortIcon={<ArrowDownward />}  
      dense={true}
      customStyles={customStyles}
    >
    </Datatable>
    
    <ComponenteGraficoExcel data={registrosdet} columnNames={meses} />    

  </>
  );
}
