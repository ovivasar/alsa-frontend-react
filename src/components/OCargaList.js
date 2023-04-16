import React from 'react';
import { useEffect, useState, useMemo, differenceBy, useCallback } from "react"
import { Grid, Button, CircularProgress, Card, CardContent, Typography } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Add from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import IconButton from '@mui/material/IconButton';
import swal from 'sweetalert';
import axios from 'axios';
import Datatable, {createTheme} from 'react-data-table-component';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import '../App.css';
import 'styled-components';

import { utils, writeFile } from 'xlsx';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function OCargaList() {
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
    },
  }, 'dark');
  ///////////////////////
  function exportToExcel(data) {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Datos');
    writeFile(workbook, 'datos.xlsx');
  }
  /*function exportToExcel(data) {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Datos');
    const excelBuffer = writeFile(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const dataUrl = URL.createObjectURL(blob);
    window.open(dataUrl, '_blank');
  }*/
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	
  const [registrosdet,setRegistrosdet] = useState([]); //Para vista principal
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado
  
  const [valorVista, setValorVista] = useState("resumen");
  const [eliminacionCompletada, setEliminacionCompletada] = useState(false);

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");
		const handleDelete = () => {
			var strFecha;
      var strAno;
      var strNumero;
      var nItem;
      strFecha = selectedRows.map(r => r.fecha);
      strNumero = selectedRows.map(r => r.numero);
      nItem = selectedRows.map(r => r.item);

      const fechaArmada = new Date(strFecha); //ok con hora 00:00:00
      strAno = (fechaArmada.getFullYear()).toString(); 
  
			confirmaEliminacion(strAno,strNumero,nItem);
		};

    const handleUpdate = () => {
			var strFecha;
      var strAno;
      var strNumero;
      var nItem;
      var sModo;
      strFecha = selectedRows.map(r => r.fecha);
      strNumero = selectedRows.map(r => r.numero);
      nItem = selectedRows.map(r => r.item);
      const fechaArmada = new Date(strFecha); //ok con hora 00:00:00
      strAno = (fechaArmada.getFullYear()).toString(); 
      
      sModo = "editar";
      navigate(`/ocargadet/${params.fecha_proceso}/${strAno}/${strNumero}/${nItem}/${sModo}/edit`);      
		};

    const handleUpdateGrupo = () => {
			var strFecha;
      var strAno;
      var strNumero;
      var nItem;
      var sModo;
      strFecha = selectedRows.map(r => r.fecha);
      strNumero = selectedRows.map(r => r.numero);
      nItem = selectedRows.map(r => r.item);
      const fechaArmada = new Date(strFecha); //ok con hora 00:00:00
      strAno = (fechaArmada.getFullYear()).toString(); 
      
      sModo = "editar";
      navigate(`/ocarga/${strAno}/${strNumero}/edit`);
		};

    const handleClonar = () => {
			var strFecha;
      var strAno;
      var strNumero;
      var nItem;
      var sModo;
      strFecha = selectedRows.map(r => r.fecha);
      strNumero = selectedRows.map(r => r.numero);
      nItem = selectedRows.map(r => r.item);
      const fechaArmada = new Date(strFecha); //ok con hora 00:00:00
      strAno = (fechaArmada.getFullYear()).toString(); 

      sModo = "clonar";
      navigate(`/ocargadet/${params.fecha_proceso}/${strAno}/${strNumero}/${nItem}/${sModo}/edit`);
		};

  
		return (
      <>
			<Button key="delete" onClick={handleDelete} >
       ELIMINAR <DeleteIcon/>
			</Button>
			
      {/*
      <Button key="modificar" onClick={handleUpdate} >
       MODIFICAR<EditRoundedIcon/>
			</Button>
    */}
    
      <Button key="modificar_grupo" onClick={handleUpdateGrupo} >
       MOD. GRUPO<EditRoundedIcon/>
			</Button>

			<Button key="clonar" onClick={handleClonar} >
       CLONAR<ContentCopyIcon/>
			</Button>
      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  const actions = (
    	<IconButton color="primary" 
        onClick = {()=> {
                    //navigate(`/ocargadet/${params.fecha_proceso}/new`);
                    navigate(`/ocargadet01/${params.fecha_proceso}/new`)
                  }
                }
      >
    		<Add />
    	</IconButton>
  );

  const cargaRegistro = async () => {
    var response;
    let strFechaIni="";
    let strFecha="";
    //La data, corresponde al mes de login
    //le cargaremos fecha actual si parametro no existe
    strFechaIni=params.fecha_ini;
    console.log("Fecha ini:",strFechaIni);

    strFecha=params.fecha_proceso;
    
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }
    
    console.log("valor antes de cargar backend: ", valorVista);
    //al reves por mientras
    if (valorVista=="analisis"){
      response = await fetch(`${back_host}/ocargaplan/${strFechaIni}/${strFecha}`);
    }else{
      if (valorVista=="diario"){
        response = await fetch(`${back_host}/ocargaplan/${strFecha}/${strFecha}`);
      }else{
        response = await fetch(`${back_host}/ocarga/${strFecha}`);
      }
    }

    
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }
  //////////////////////////////////////
  const columnas = [
    { name:'FECHA', 
      selector:row => row.fecha,
      sortable: true,
      key:true
    },
    { name:'PEDIDO', 
      selector:row => row.pedido,
      sortable: true
    },
    { name:'NUMERO', 
      selector:row => row.numero,
      sortable: true
    },
    { name:'ESTADO', 
      selector:row => row.estado,
      sortable: true
    },
    { name:'CLIENTE', 
      selector:row => row.ref_razon_social,
      sortable: true
    },
    { name:'ITEM', 
      selector:row => row.item,
      sortable: true
    },
    { name:'DESCRIPCION', 
      selector:row => row.descripcion,
      sortable: true
    },
    { name:'OPERACION', 
      selector:row => row.operacion,
      sortable: true
    },
    { name:'ENTREGA', 
      selector:row => row.zona_entrega,
      sortable: true
    },
    { name:'GUIA', 
      selector:row => row.guia01,
      sortable: true
    },
    { name:'TICKET', 
      selector:row => row.ticket,
      sortable: true
    },
    { name:'LOTE ASIGNADO', 
      selector:row => row.lote_asignado,
      sortable: true
    },
    { name:'LOTE PROCEDENCIA', 
      selector:row => row.lote_procedencia,
      sortable: true
    },
    { name:'PESO V.', 
      selector:row => row.e_peso01,
      sortable: true
    },
    { name:'MONTO S/', 
      selector:row => row.e_monto01,
      sortable: true
    },
    { name:'RHH', 
      selector:row => row.e_razon_social,
      sortable: true
    },
    { name:'INICIO', 
      selector:row => row.e_hora_ini,
      sortable: true
    },
    { name:'FINAL', 
      selector:row => row.e_hora_fin,
      sortable: true
    },
    { name:'ESTIBAS', 
      selector:row => row.e_estibadores,
      sortable: true
    },
    { name:'AÑO', 
      selector:row => row.ano,
      sortable: true
    }
  ];

  const confirmaEliminacion = async(ano,numero,item) =>{
    //Eliminar por numeor y item, estamos en vista planilla
    await swal({
      title:"Eliminar Registro",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          //console.log(ano,numero,item);
          //console.log(ano,numero[0],item[0]);
          eliminarRegistroSeleccionado(ano,numero[0],item[0]);

          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(
                          registrosdet => (registrosdet.ano !== ano &&
                                          registrosdet.numero !== numero[0] && 
                                          registrosdet.item !== item[0])
                          ));
          
          setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
              setUpdateTrigger(Math.random());//experimento
          }, 200);
         
          
          swal({
            text:"Venta se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }

/*  const confirmaEliminacion = (ano,numero,item)=>{
    //Eliminar por numeor y item, estamos en vista planilla
    swal({
      title:"Eliminar Registro",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarRegistroSeleccionado(ano,numero,item);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(
                          registrosdet => registrosdet.ano !== ano &&
                                          registrosdet.numero !== numero && 
                                          registrosdet.item !== item
                          ));
          setUpdateTrigger(Math.random());//experimento
  
          swal({
            text:"Venta se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }
 */

  const navigate = useNavigate();

  const eliminarRegistroSeleccionado = async (ano,numero,item) => {
    await fetch(`${back_host}/ocargadet/${ano}/${numero}/${item}`, {
      method:"DELETE"
    });
    setEliminacionCompletada(true); 
    //console.log(data);
  }

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
        if (elemento.ref_razon_social.toString().toLowerCase().includes(strBusca.toLowerCase())
         || elemento.e_estibadores.toString().toLowerCase().includes(strBusca.toLowerCase())
         || elemento.descripcion.toString().toLowerCase().includes(strBusca.toLowerCase())
          ){
              return elemento;
          }
      });
      setRegistrosdet(resultadosBusqueda);
  }

  //////////////////////////////////////////////////////////
  useEffect( ()=> {
      cargaRegistro();
  },[updateTrigger])
  //////////////////////////////////////////////////////////

 return (
  <>
  <Grid container>
    <Grid item xs={10}>
      <TextField fullWidth variant="outlined" color="warning" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="busqueda"
                                   placeholder='Cliente   Producto   Estibaje'
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
      <Button variant='contained' 
              color='success' 
              sx={{display:'block',
              margin:'.5rem 0'}}
              onClick={ ()=>{
                exportToExcel(registrosdet);
                    }
              }
              >
      EXCEL
      </Button>
    </Grid>
    <Grid item xs={1.1}>    
      <Button variant='contained' 
              color='warning' 
              sx={{display:'block',
              margin:'.5rem 0'}}
              >
      PDF-Rep
      </Button>
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
      <ToggleButton value="resumen">Resumen</ToggleButton>
      <ToggleButton value="analisis">Analisis</ToggleButton>
      <ToggleButton value="diario">Diario</ToggleButton>
    </ToggleButtonGroup>      
    </div>

    <Datatable
      title="Registro - Ordenes Carga"
      theme="solarized"
      columns={columnas}
      data={registrosdet}
      selectableRows
      contextActions={contextActions}
      actions={actions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
      //pagination

      selectableRowsComponent={Checkbox} // Pass the function only
      sortIcon={<ArrowDownward />}  

    >

    </Datatable>

  </>
  );
}
