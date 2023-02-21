import React from 'react';
import { useEffect, useState, useMemo, differenceBy, useCallback } from "react"
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
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
import Box from '@mui/material/Box';

export default function OCargaList() {
  //Para recibir parametros desde afuera
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

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
	
  const [registrosdet,setRegistrosdet] = useState([]); //Para vista principal
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado
  const [valorBusqueda, setValorBusqueda] = useState(""); //txt: rico filtrado

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
			
      <Button key="modificar" onClick={handleUpdate} >
       MODIFICAR<EditRoundedIcon/>
			</Button>

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
    let strFecha="";
    //La data, corresponde al mes de login
    //le cargaremos fecha actual si parametro no existe
    strFecha=params.fecha_proceso;
    console.log(strFecha);
    if (params.fecha_proceso===null){
      let nPos=0;
      const fecha = new Date(); //ok fecha y hora actual
      strFecha = fecha.toISOString(); //formato texto
      nPos = strFecha.indexOf('T');
      strFecha = strFecha.substr(0,nPos);
    }
    
    const response = await fetch(`http://localhost:4000/ocargaplan/${strFecha}`);
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
    { name:'ENTREGA', 
      selector:row => row.zona_entrega,
      sortable: true
    },
    { name:'NUMERO', 
      selector:row => row.numero,
      sortable: true
    },
    { name:'ITEM', 
      selector:row => row.item,
      sortable: true
    },
    { name:'GUIA', 
      selector:row => row.guia,
      sortable: true
    },
    { name:'OPERACION', 
      selector:row => row.operacion,
      sortable: true
    },
    { name:'TICKET', 
      selector:row => row.ticket,
      sortable: true
    },
    { name:'DESCRIPCION', 
      selector:row => row.descripcion,
      sortable: true
    },
    { name:'RAZON SOCIAL', 
      selector:row => row.ref_razon_social,
      sortable: true
    },
    { name:'DESAG. SACOS', 
      selector:row => row.desag_sacos,
      sortable: true
    },
    { name:'DESAG. TN.', 
      selector:row => row.desag_tn,
      sortable: true
    },
    { name:'TOTAL SACOS', 
      selector:row => row.llega_sacos,
      sortable: true
    },
    { name:'OPERACION2', 
      selector:row => row.operacion2,
      sortable: true
    },
    { name:'TRANSB. SACOS', 
      selector:row => row.sacos_transb,
      sortable: true
    },
    { name:'SACOS DESCARG', 
      selector:row => row.sacos_descar,
      sortable: true
    },
    { name:'LOTE ASIGNADO', 
      selector:row => row.lote_asignado,
      sortable: true
    },
    { name:'SACOS CARGA', 
      selector:row => row.sacos_carga,
      sortable: true
    },
    { name:'LOTE PROCEDENCIA', 
      selector:row => row.lote_procedencia,
      sortable: true
    },
    { name:'SACOS FINAL', 
      selector:row => row.sacos_final,
      sortable: true
    },
    
    { name:'TARA DESAG.', 
      selector:row => row.tara_desag,
      sortable: true
    },
    { name:'PESO V.', 
      selector:row => row.e_peso,
      sortable: true
    },
    { name:'MONTO S/', 
      selector:row => row.e_monto,
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
  
  const confirmaEliminacion = (ano,numero,item)=>{
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
 
  const navigate = useNavigate();

  const eliminarRegistroSeleccionado = async (ano,numero,item) => {
    await fetch(`http://localhost:4000/ocargadet/${ano}/${numero}/${item}`, {
      method:"DELETE"
    });
    //console.log(data);
  }

  const actualizaValorFiltro = e => {
    setValorBusqueda(e.target.value);
    filtrar(e.target.value);
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
    <div> 
      <TextField fullWidth variant="outlined" color="warning"
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
    </div>

    <Datatable
      title="Panel de Ordenes Carga"
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
