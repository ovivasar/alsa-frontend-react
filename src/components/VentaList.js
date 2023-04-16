import React from 'react';
import { useEffect, useState, useMemo, differenceBy, useCallback } from "react"
import { Grid, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import Add from '@mui/icons-material/Add';

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
import { sizeWidth } from '@mui/system';

import { utils, writeFile } from 'xlsx';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function VentaList() {

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
  ///////////////////////////////////////////////////
  function exportToExcel(data) {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Datos');
    writeFile(workbook, 'datos.xlsx');
  }

  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	//const [data, setData] = useState(tableDataItems);
  const [registrosdet,setRegistrosdet] = useState([]);
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [navegadorMovil, setNavegadorMovil] = useState(false);
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado
  const [valorVista, setValorVista] = useState("resumen");

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);

  const handleRecarga = () => {
    setUpdateTrigger(Math.random());//experimento
  };

  const contextActions = useMemo(() => {

		const handleDelete = () => {
			var strCod;
      var strSerie;
      var strNum;
      var strElem;
      var strItem;
      strCod = selectedRows.map(r => r.comprobante_original_codigo);
      strSerie = selectedRows.map(r => r.comprobante_original_serie);
      strNum = selectedRows.map(r => r.comprobante_original_numero);
      strElem = selectedRows.map(r => r.elemento);
      strItem = selectedRows.map(r => r.item);
      //console.log(strElem);
      console.log(valorVista);
      if (valorVista=="resumen"){
			  confirmaEliminacion(strCod,strSerie,strNum,strElem,strItem);
      }else{
          swal({
            text:"NO SE PUEDE ELIMINAR DETALLE DE VENTA, PROCEDA DESDE VISTA RESUMEN",
            icon:"warning",
            timer:"2000"
          });
      }
		};

    const verificaNavegadorMovil = () =>{
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
          console.log("Estás usando un dispositivo móvil!!");
          setNavegadorMovil(true);
      } else {
          console.log("No estás usando un móvil");
          setNavegadorMovil(false);
      }    
    };
  
    const handleUpdate = () => {
			var strCod;
      var strSerie;
      var strNum;
      var strElem;
      strCod = selectedRows.map(r => r.comprobante_original_codigo);
      strSerie = selectedRows.map(r => r.comprobante_original_serie);
      strNum = selectedRows.map(r => r.comprobante_original_numero);
      strElem = selectedRows.map(r => r.elemento);
      
      if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
        console.log("Estás usando un dispositivo móvil!!");
        navigate(`/ventamovil/${strCod}/${strSerie}/${strNum}/${strElem}/edit`);
        //navigate(`/venta/${strCod}/${strSerie}/${strNum}/${strElem}/edit`);
      } else {
        console.log("No estás usando un móvil");
        navigate(`/venta/${strCod}/${strSerie}/${strNum}/${strElem}/edit`);
        //navigate(`/ventamovil/${strCod}/${strSerie}/${strNum}/${strElem}/edit`);
      }    
  	};

		return (
      <>
			<Button key="delete" onClick={handleDelete} >
        ELIMINAR
        <DeleteIcon></DeleteIcon>
			</Button>
			<Button key="modificar" onClick={handleUpdate} >
        MODIFICAR
      <UpdateIcon/>
			</Button>

      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  const actions = (
      <IconButton color="primary" 
        onClick = {()=> {
                      navigate(`/venta/new`);
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

    strFecha=params.fecha_proceso;
    //console.log(strFecha);
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }
    
    //response = await fetch(`${back_host}/ventaplan/${strFecha}`);
    //response = await fetch(`${back_host}/venta/${strFecha}`);

    if (valorVista=="analisis"){
      response = await fetch(`${back_host}/ventaplan/${strFechaIni}/${strFecha}`);
    }else{
      if (valorVista=="diario"){
        response = await fetch(`${back_host}/ventaplan/${strFecha}/${strFecha}`);
      }else{
        response = await fetch(`${back_host}/venta/${strFechaIni}/${strFecha}`);
      }
    }

    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }
  //////////////////////////////////////
  const columnas = [
    { name:'FECHA', 
      selector:row => row.comprobante_original_fecemi,
      sortable: true
    },
    { name:'PEDIDO', 
      selector:row => row.pedido,
      sortable: true
    },
    { name:'VENDEDOR', 
      selector:row => row.vendedor,
      sortable: true,
      key:true
    },
    { name:'CLIENTE', 
      selector:row => row.razon_social,
      sortable: true
    },
    { name:'ENTREGA', 
      selector:row => row.zona_entrega,
      sortable: true
    },
    { name:'PRODUCTO', 
      selector:row => row.descripcion,
      sortable: true
    },
    { name:'PROYECTADO', 
      selector:row => row.fecha_entrega,
      sortable: true
    },
    { name:'ESTADO', 
      selector:row => row.estado,
      sortable: true
    },
    { name:'RUC TRANSP.', 
      selector:row => row.tr_ruc,
      sortable: true
    },
    { name:'TRANSP.', 
    selector:row => row.tr_razon_social,
      sortable: true
    },
    { name:'CHOFER', 
    selector:row => row.tr_chofer,
      sortable: true
    },
    { name:'CELULAR', 
    selector:row => row.tr_celular,
      sortable: true
    },
    { name:'PLACA', 
    selector:row => row.tr_placa,
      sortable: true
    },
    { name:'F.CARGA', 
    selector:row => row.tr_fecha_carga,
      sortable: true
    }

  ];
  
  const confirmaEliminacion = async(cod,serie,num,elem,item)=>{
    await swal({
      title:"Eliminar Registro",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          console.log(cod,serie,num,elem,item);
          eliminarRegistroSeleccionado(cod,serie,num,elem,item);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(
                          registrosdet => registrosdet.comprobante_original_codigo !== cod &&
                                          registrosdet.comprobante_original_serie !== serie &&
                                          registrosdet.comprobante_original_numero !== num  && 
                                          registrosdet.elemento !== elem
                          ));
          setTimeout(() => { // Agrega una función para que se ejecute después del tiempo de espera
              setUpdateTrigger(Math.random());//experimento
          }, 200);
                        
          //setUpdateTrigger(Math.random());//experimento
  
          swal({
            text:"Venta se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }
 
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const eliminarRegistroSeleccionado = async (cod,serie,num,elem,item) => {
    //En ventas solo se eliminan, detalle-cabecera
    if (valorVista=="resumen"){
      //borrar maestro-detalle
      //console.log(`${back_host}/venta/${cod}/${serie}/${num}/${elem}`);
      await fetch(`${back_host}/venta/${cod}/${serie}/${num}/${elem}`, {
        method:"DELETE"
      });
    }
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
        if (elemento.razon_social.toString().toLowerCase().includes(strBusca.toLowerCase())
         || elemento.vendedor.toString().toLowerCase().includes(strBusca.toLowerCase())
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
    <Grid item xs={9}>
      <TextField fullWidth variant="outlined" color="success" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="busqueda"
                                   placeholder='Cliente   Vendedor   Producto'
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

    </Grid>
    <Grid item xs={0.9}>    
      <Button variant='contained' 
              fullWidth
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
      color="success"
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
      title="Registro - Pedidos"
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
