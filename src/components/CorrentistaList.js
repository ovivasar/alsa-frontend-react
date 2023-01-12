import React from 'react';
import { useEffect, useState, useMemo, differenceBy, useCallback } from "react"
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import FindIcon from '@mui/icons-material/FindInPage';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import SendIcon from '@mui/icons-material/Send';
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

export default function CorrentistaList() {
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
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.documento_id);
			confirmaEliminacion(strSeleccionado);
		};

    const handleUpdate = () => {
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.documento_id);
			navigate(`/correntista/${strSeleccionado}/edit`);
		};

		return (
      <>
			<Button key="delete" onClick={handleDelete} >
        ELIMINAR
			</Button>
			<Button key="modificar" onClick={handleUpdate} >
      <UpdateIcon/>
			</Button>

      </>
		);
	}, [registrosdet, selectedRows, toggleCleared]);

  const actions = (
    	<IconButton color="primary" 
        onClick = {()=> {
                      navigate(`/correntista/new`);
                  }
                }
      >
    		<Add />
    	</IconButton>
  );

  //////////////////////////////////////////////////////////
  //const [registrosdet,setRegistrosdet] = useState([]);
  //////////////////////////////////////////////////////////
  const cargaRegistro = async () => {
    const response = await fetch(`http://localhost:4000/correntista`);
    const data = await response.json();
    setRegistrosdet(data);
  }
  //////////////////////////////////////
  const columnas = [
    { name:'RUC / DNI', 
      selector:row => row.documento_id,
      sortable: true,
      key:true
    },
    { name:'Razon Social', 
      selector:row => row.razon_social,
      sortable: true
    },
    { name:'Telefono', 
      selector:row => row.telefono,
      sortable: true
    }
  ];
  
  const confirmaEliminacion = (id_registro)=>{
    swal({
      title:"Eliminar Correntista",
      text:"Seguro ?",
      icon:"warning",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarRegistroDet(id_registro);
          setToggleCleared(!toggleCleared);
          setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.documento_id !== id_registro));
          setUpdateTrigger(Math.random());//experimento
  
          swal({
            text:"Correnstita se ha eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }
 
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const eliminarRegistroDet = async (id_registro) => {
    await fetch(`http://localhost:4000/correntista/${id_registro}`, {
      method:"DELETE"
    });
    //setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.documento_id !== id_registro));
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
      title="Gestion de Correntistas"
      theme="solarized"
      columns={columnas}
      data={registrosdet}
      selectableRows
      contextActions={contextActions}
      actions={actions}
			onSelectedRowsChange={handleRowSelected}
			clearSelectedRows={toggleCleared}
      pagination

      selectableRowsComponent={Checkbox} // Pass the function only
      sortIcon={<ArrowDownward />}  

    >
    </Datatable>

  </>
  );
}
