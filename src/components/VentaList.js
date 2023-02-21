import React from 'react';
import { useEffect, useState, useMemo, differenceBy, useCallback } from "react"
import { Button, Card, CardContent, Typography } from "@mui/material";
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

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	//const [data, setData] = useState(tableDataItems);
  const [registrosdet,setRegistrosdet] = useState([]);

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");
		const handleDelete = () => {
			var strCod;
      var strSerie;
      var strNum;
      var strElem;
      strCod = selectedRows.map(r => r.comprobante_original_codigo);
      strSerie = selectedRows.map(r => r.comprobante_original_serie);
      strNum = selectedRows.map(r => r.comprobante_original_numero);
      strElem = selectedRows.map(r => r.elemento);
			confirmaEliminacion(strCod,strSerie,strNum,strElem);
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

			navigate(`/venta/${strCod}/${strSerie}/${strNum}/${strElem}/edit`);
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
    let strFecha="";
    //La data, corresponde al mes de login
    //le cargaremos fecha actual si parametro no existe
    strFecha=params.fecha_proceso;
    //console.log(strFecha);
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }
    
    const response = await fetch(`http://localhost:4000/ventaplan/${strFecha}`);
    //const response = await fetch(`http://localhost:4000/ventaplan`);
    const data = await response.json();
    setRegistrosdet(data);
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
      selector:row => row.tipo_op,
      sortable: true,
      key:true
    },
    { name:'CLIENTE', 
      selector:row => row.ref_razon_social,
      sortable: true
    },
    { name:'PRODUCTO', 
      selector:row => row.descripcion,
      sortable: true
    },
    { name:'FECHA PROY.CARGA', 
      selector:row => row.fecha_entrega,
      sortable: true
    },
    { name:'ZONA VENTA', 
      selector:row => row.zona_venta,
      sortable: true
    },
    { name:'ESTADO', 
      selector:row => row.estado,
      sortable: true
    }
  ];
  
  const confirmaEliminacion = (cod,serie,num,elem)=>{
    swal({
      title:"Eliminar Registro",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarRegistroSeleccionado(cod,serie,num,elem);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(
                          registrosdet => registrosdet.comprobante_original_codigo !== cod &&
                                          registrosdet.comprobante_original_serie !== serie &&
                                          registrosdet.comprobante_original_numero !== num &&
                                          registrosdet.elemento !== elem
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
 
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const eliminarRegistroSeleccionado = async (cod,serie,num,elem) => {
    await fetch(`http://localhost:4000/venta/${cod}/${serie}/${num}/${elem}`, {
      method:"DELETE"
    });
    //console.log(data);
  }

  //////////////////////////////////////////////////////////
  useEffect( ()=> {
      cargaRegistro();
  },[updateTrigger])
  //////////////////////////////////////////////////////////

 return (
  <>
    <div> 
      <TextField variant="filled" 
                                   label="busqueda"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="busqueda"
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
    </div>

    <Datatable
      title="Registro de Ventas/Pedidos"
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
