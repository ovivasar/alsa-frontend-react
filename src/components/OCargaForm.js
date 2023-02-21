import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl, Switch, FormControlLabel, Checkbox} from '@mui/material'
import {useState,useEffect,useCallback,useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import AddBoxRoundedIcon from '@mui/icons-material/AddToQueue';
import BorderColorIcon from '@mui/icons-material/EditRounded';
import GroupsIcon from '@mui/icons-material/Groups';
import FindIcon from '@mui/icons-material/FindInPage';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import DnsTwoToneIcon from '@mui/icons-material/DnsTwoTone';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SummarizeIcon from '@mui/icons-material/Summarize';

import DateFnsUtils from '@date-io/date-fns';
import swal from 'sweetalert';

export default function OCargaForm() {
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  const [registrosdet,setRegistrosdet] = useState([]);
  //const fecha_actual = new Date();

  const [ocarga,setOCarga] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      fecha:'',
      numero:'',
      registrado:'1'
  })
  
  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    var data;

    //Cambiooo para controlar Edicion
    if (editando){
      await fetch(`http://localhost:4000/ocarga/${params.ano}/${params.numero}`, {
        method: "PUT",
        body: JSON.stringify(ocarga),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      //console.log(venta);
      const res = await fetch("http://localhost:4000/ocarga", {
        method: "POST",
        body: JSON.stringify(ocarga),
        headers: {"Content-Type":"application/json"}
      });
      //nuevo
      data = await res.json();
    }
    setCargando(false);
    
    setEditando(true);
    //Obtener json respuesta, para extraer cod,serie,num y elemento
    navigate(`/ocarga/${data.ano}/${data.numero}/edit`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.numero){
      mostrarOCargaDetalle(params.ano,params.numero);
      mostrarOCarga(params.ano,params.numero);
    }
    
  },[params.numero]);


  //Rico evento change
  const handleChange = e => {
    setOCarga({...ocarga, [e.target.name]: e.target.value});
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarOCarga = async (ano,numero) => {
    const res = await fetch(`http://localhost:4000/ocarga/${ano}/${numero}`);
    const data = await res.json();
    setOCarga({  
                fecha:data.fecha,
                numero:data.numero
              });
    setEditando(true);

  };
  
  const mostrarOCargaDetalle = async (ano,numero) => {
    const res = await fetch(`http://localhost:4000/ocargadet/${ano}/${numero}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
    //console.log(registrosdet.length);
    setEditando(true);
  };

  const eliminarVentaDetalleItem = async (ano,numero,item) => {
    await fetch(`http://localhost:4000/ocargadet/${ano}/${numero}/${item}`, {
      method:"DELETE"
    });
    
    setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.ano !== ano ||
                                                        registrosdet.numero !== numero ||
                                                        registrosdet.item !== item                                                        
    ));
    //console.log(data);
  }

  const confirmaEliminacionDet = (ano,numero,item)=>{
    swal({
      title:"Eliminar Orden de Carga",
      text:"Seguro ?",
      icon:"warning",
      timer:"3000",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarVentaDetalleItem(ano,numero,item);
            swal({
            text:"Detalle de Carga eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }

  return (
  <> 
      <div></div>
      <Grid item xs={12}>
            
            <Card sx={{mt:3}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  >
                <Typography variant='5' color='white' textAlign='center'>
                    {editando ? "EDITAR ORDEN" : "REGISTRAR ORDEN"}
                </Typography>
                
                <CardContent >
                    <form onSubmit={handleSubmit} >
                      <Grid container spacing={0.5}>
                          


                          <Grid item xs={2}>
                          <TextField variant="outlined" 
                                    //label="fecha"
                                    sx={{display:'block',
                                          margin:'.5rem 0'}}
                                    name="fecha"
                                    type="date"
                                    //format="yyyy/MM/dd"
                                    value={ocarga.fecha}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                          />
                          </Grid>
                          
                          <Grid item xs={1.5}>
                            <TextField variant="outlined" 
                                        label="ORDEN CARGA"
                                        sx={{display:'block',
                                                margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="numero"
                                        value={ocarga.numero}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />
                          </Grid>
                         
                      </Grid>
                    </form>

                </CardContent>
            </Card>
            
        </Grid>

        {/* /////////////////////////////////////////////////////////////// */}
        <Card sx={{mt:0.1}} 
            style={{
              background:'#1e272e',
              padding:'1rem',
              height:'3rem',
              marginTop:".2rem"
            }}
            key={registrosdet.ref_documento_id}
            >
          
          <CardContent style={{color:'#4264EE'}}>

              <Grid container spacing={0.5}>

                  <Grid item xs={0.5}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> {
                                  let agrega;
                                  agrega = "nuevo"
                                  navigate(`/ocargadet01/${ocarga.fecha}/${params.ano}/${params.numero}/${agrega}/new`);
                                  }
                                }
                    >
                      <AddBoxRoundedIcon />
                    </IconButton>
                    
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    
                  </Grid>

                  <Grid item xs={0.5}>
                    
                  </Grid>

                  <Grid item xs={0.5}>
                    
                  </Grid>

                  <Grid item xs={1.5}>
                    IDENTIDAD
                  </Grid>

                  <Grid item xs={2}>
                    CLIENTE
                  </Grid>

                  <Grid item xs={1}>
                    PRODUCTO
                  </Grid>

                  <Grid item xs={1}>
                    ZONA
                  </Grid>
                  
                  <Grid item xs={1}>
                    CANTIDAD
                  </Grid>

                  <Grid item xs={1}>
                    
                  </Grid>

              </Grid>

              </CardContent>
          </Card>
        {/* /////////////////////////////////////////////////////////////// */}

    {
      
      registrosdet.map((indice) => (
     
            <Card sx={{mt:0.1}}
            style={{
              background:'#1e272e',
              padding:'1rem',
              height:'3rem',
              marginTop:".2rem"
            }}
            key={indice.ref_documento_id}
            >
          
          <CardContent style={{color:'white'}}>

              <Grid container spacing={0.5}>

                  <Grid item xs={0.5}>
                    <Tooltip title="DATOS Carga/Descarga">
                      <IconButton color="secondary" aria-label="upload picture" component="label" size="small"
                                  sx={{ color: '#0277BD' }}
                                  onClick = {()=> navigate(`/ocargadet01/${ocarga.fecha}/${params.ano}/${indice.numero}/${indice.item}/editar/edit`)}
                      >
                        <DnsTwoToneIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    <Tooltip title="DATOS Almacen">
                      <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                  sx={{ color: '#1565C0' }}
                                  onClick = {()=> navigate(`/ocargadet02/${ocarga.fecha}/${params.ano}/${indice.numero}/${indice.item}/editar/edit`)}
                      >
                        <HolidayVillageIcon />
                      </IconButton>
                    </Tooltip>  
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    <Tooltip title="DATOS Peso/Estibaje">
                      <IconButton color="success" aria-label="upload picture" component="label" size="small"
                                  sx={{ color: '#283593' }}
                                  onClick = {()=> navigate(`/ocargadet03/${ocarga.fecha}/${params.ano}/${ocarga.numero}/${indice.item}/editar/edit`)}
                      >
                        <SummarizeIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>

                  <Grid item xs={0.5}>
                    <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                                onClick = { () => confirmaEliminacionDet(params.ano
                                                                          ,params.numero
                                                                          ,indice.item)
                                          }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>

                  <Grid item xs={1.5}>
                      <Typography fontSize={15} marginTop="0rem" >
                      {indice.ref_documento_id}
                      </Typography>
                  </Grid>

                  <Grid item xs={2}>
                      <Typography fontSize={15} marginTop="0rem" >
                        {indice.ref_razon_social}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.descripcion}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.zona_entrega}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.cantidad}
                      </Typography>
                  </Grid>

                  <Grid item xs={2}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.ref_observacion}
                      </Typography>
                  </Grid>

              </Grid>

              </CardContent>
          </Card>


      ))
    }


  </>    
  );
}
