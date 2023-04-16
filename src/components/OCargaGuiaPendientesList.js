import React from 'react';
import { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import FindIcon from '@mui/icons-material/FindInPage';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import Add from '@mui/icons-material/Add';

import IconButton from '@mui/material/IconButton';
import Datatable, {createTheme} from 'react-data-table-component';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import '../App.css';
import 'styled-components';


export default function OCargaGuiaPendientesList() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
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
      //background: '#cb4b16',
      background: '#1e272e',
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
  const [tabladet,setTabladet] = useState([]);  //Copia de los registros: Para tratamiento de filtrado

  const handleRowSelected = useCallback(state => {
		setSelectedRows(state.selectedRows);
	}, []);
  
  const contextActions = useMemo(() => {
    //console.log("asaaa");

    const handleUpdate = () => {
			var strSeleccionado;
      strSeleccionado = selectedRows.map(r => r.id_zona);
			navigate(`/zona/${strSeleccionado}/edit`);
		};

		return (
      <>
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
                      navigate(`/zona/new`);
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
    var response;
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

    response = await fetch(`${back_host}/ocargadetguiaspendientes/${strFecha}`);
    const data = await response.json();
    setRegistrosdet(data);
    setTabladet(data); //Copia para tratamiento de filtrado
  }
  //////////////////////////////////////
  const columnas = [
    { name:'AÑO', 
      selector:row => row.ano,
      sortable: true,
      width: '110px'
      //key:true
    },
    { name:'ORDEN', 
      selector:row => row.numero,
      //width: '350px',
      sortable: true
    },
    { name:'GUIA', 
      selector:row => row.guia,
      width: '150px',
      sortable: true
    },
    { name:'MONTO', 
      selector:row => row.e_monto,
      width: '150px',
      sortable: true
    },
    { name:'GRUPO', 
      selector:row => row.grupo,
      width: '150px',
      sortable: true
    }
  ];
 
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const actualizaValorFiltro = e => {
    //setValorBusqueda(e.target.value);
    filtrar(e.target.value);
  }
  const filtrar=(strBusca)=>{
    var resultadosBusqueda = [];
    resultadosBusqueda = tabladet.filter((elemento) => {
      if (elemento.nombre.toString().toLowerCase().includes(strBusca.toLowerCase())
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
      <TextField fullWidth variant="outlined" color="success" size="small"
                                   label="FILTRAR"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="busqueda"
                                   placeholder='Zona'
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
      title="Guias Pendientes"
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
      dense={true}
      //customStyles={{ rows: { minHeight: '10px' } }}
    >
    </Datatable>

  </>
  );
}


/*

const App = () => {
  const [registrosdet, setRegistrosdet] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://alsa-backend-js-production.up.railway.app/ocargadetguiaspendientes');
      const data = await response.json();
      setRegistrosdet(data);
    };
    fetchData();
  }, []);

  const handleModificar = (row) => {
    // Aquí puedes agregar la lógica para modificar la fila seleccionada
    console.log(`Modificar fila ${row.numero}`);
  };

  return (
    <DataTable
      title="Listado de guías pendientes"
      columns={columns}
      data={registrosdet}
      highlightOnHover
      pointerOnHover
    />
  );
};

export default App;
*/