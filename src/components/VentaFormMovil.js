import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
import { useState,useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import AddBoxRoundedIcon from '@mui/icons-material/ShoppingCart';
import BorderColorIcon from '@mui/icons-material/QrCodeRounded';

import DeleteIcon from '@mui/icons-material/DeleteForeverRounded';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShippingTwoTone';
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';

import swal from 'sweetalert';

export default function VentaFormMovil() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  //Select(Combos) para llenar, desde tabla
  const [operacion_select] = useState([
    {tipo_op:'VENTA'},
    {tipo_op:'TRASLADO'}
  ]);

  const [zona_select,setZonaSelect] = useState([]);
  const [vendedor_select,setVendedorSelect] = useState([]);
  const [cliente_select,setClienteSelect] = useState([]);

  const [registrosdet,setRegistrosdet] = useState([]);
  //const fecha_actual = new Date();

  const [venta,setVenta] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      tipo_op:'',
      id_zona_venta:'',
      zona_venta:'',
      id_vendedor:'',
      vendedor:'',
      comprobante_original_fecemi:'',
      documento_id:'', //cliente
      razon_social:'', //cliente
      debe:'0',
      peso_total:'0',
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
      await fetch(`${back_host}/venta/${params.cod}/${params.serie}/${params.num}/${params.elem}`, {
        method: "PUT",
        body: JSON.stringify(venta),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log(`${back_host}/venta`);
      console.log(venta);
      const res = await fetch(`${back_host}/venta`, {
        method: "POST",
        body: JSON.stringify(venta),
        headers: {"Content-Type":"application/json"}
      });
      //nuevo
      data = await res.json();
    }
    setCargando(false);
    
    setEditando(true);
    //Obtener json respuesta, para extraer cod,serie,num y elemento
    navigate(`/venta/${data.comprobante_original_codigo}/${data.comprobante_original_serie}/${data.comprobante_original_numero}/${data.elemento}/edit`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.cod){
      mostrarVenta(params.cod,params.serie,params.num,params.elem);
      mostrarVentaDetalle(params.cod,params.serie,params.num,params.elem);
    }  
    cargaZonaCombo();
    cargaVendedorCombo();
    cargaClienteCombo();
    
  },[params.cod]);

  const cargaZonaCombo = () =>{
    axios
    .get(`${back_host}/zona`)
    .then((response) => {
        setZonaSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaVendedorCombo = () =>{
    axios
    .get(`${back_host}/usuario/vendedores`)
    .then((response) => {
        setVendedorSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaClienteCombo = () =>{
    axios
    .get(`${back_host}/correntista`)
    .then((response) => {
        setClienteSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  //Rico evento change
  const handleChange = e => {
    var index;
    var sTexto;
    if (e.target.name === "id_zona_venta") {
      const arrayCopia = zona_select.slice();
      index = arrayCopia.map(elemento => elemento.id_zona).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVenta({...venta, [e.target.name]: e.target.value, zona_venta:sTexto});
      return;
    }
    if (e.target.name === "id_vendedor") {
      const arrayCopia = vendedor_select.slice();
      index = arrayCopia.map(elemento => elemento.id_vendedor).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVenta({...venta, [e.target.name]: e.target.value, vendedor:sTexto});
      return;
    }
    if (e.target.name === "documento_id") {
      const arrayCopia = cliente_select.slice();
      index = arrayCopia.map(elemento => elemento.documento_id).indexOf(e.target.value);
      sTexto = arrayCopia[index].razon_social;
      setVenta({...venta, [e.target.name]: e.target.value, razon_social:sTexto});
      return;
    }

    setVenta({...venta, [e.target.name]: e.target.value});
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarVenta = async (cod,serie,num,elem) => {
    const res = await fetch(`${back_host}/venta/${cod}/${serie}/${num}/${elem}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setVenta({  
                tipo_op:data.tipo_op,
                id_zona_venta:data.id_zona_venta,
                zona_venta:data.zona_venta,
                id_vendedor:data.id_vendedor,
                vendedor:data.vendedor,
                
                comprobante_original_codigo:data.comprobante_original_codigo,
                comprobante_original_serie:data.comprobante_original_serie,
                comprobante_original_numero:data.comprobante_original_numero,
                elemento:data.elemento,

                comprobante_original_fecemi:data.comprobante_original_fecemi,
                documento_id:data.documento_id, //cliente
                razon_social:data.razon_social, //cliente
                debe:data.debe,
                peso_total:data.peso_total,
                registrado:data.registrado
              });
    //console.log(data);
    setEditando(true);
  };
  
  const mostrarVentaDetalle = async (cod,serie,num,elem) => {
    const res = await fetch(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
    setEditando(true);
  };

  const eliminarVentaDetalleItem = async (cod,serie,num,elem,item) => {
    await fetch(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}/${item}`, {
      method:"DELETE"
    });
    
    setRegistrosdet(registrosdet.filter(registrosdet => registrosdet.comprobante_original_codigo !== cod ||
                                                        registrosdet.comprobante_original_serie !== serie ||
                                                        registrosdet.comprobante_original_numero !== num ||
                                                        registrosdet.elemento !== elem ||
                                                        registrosdet.item !== item                                                        
    ));
    //console.log(data);
  }

  const confirmaEliminacionDet = (cod,serie,num,elem,item)=>{
    swal({
      title:"Eliminar Detalle de Venta",
      text:"Seguro ?",
      icon:"warning",
      timer:"3000",
      buttons:["No","Si"]
    }).then(respuesta=>{
        if (respuesta){
          eliminarVentaDetalleItem(cod,serie,num,elem,item);
            swal({
            text:"Detalle de venta eliminado con exito",
            icon:"success",
            timer:"2000"
          });
      }
    })
  }

  //Body para Modal de Busqueda Incremental de Pedidos

  const body=(
  <div>
      {
      registrosdet.map((indice) => (
        indice ?
        <div>
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
            
          <Grid container spacing={3}
                direction="column"
                //alignItems="center"
                sx={{ justifyContent: 'flex-start' }}
          >
              
              <Grid container spacing={0}
                alignItems="center"
              > 

                  <Grid item xs={12} sm={6}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                onClick = {()=> navigate(`/ventadet/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                    <BorderColorIcon />
                    </IconButton>
                  
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                onClick = {()=> navigate(`/ventadettrans/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <LocalShippingIcon />
                    </IconButton>

                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                //onClick = {()=> navigate(`/ventadettrans/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <PictureAsPdf />
                    </IconButton>

                    <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                                sx={{ textAlign: 'left' }}
                                onClick = { () => confirmaEliminacionDet(indice.comprobante_original_codigo
                                                                          ,indice.comprobante_original_serie
                                                                          ,indice.comprobante_original_numero
                                                                          ,indice.elemento
                                                                          ,indice.item)
                                          }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                
                  <Grid item xs={12} sm={6}>
                  <Typography fontSize={15} marginTop="0rem" >
                  {indice.cantidad} {indice.unidad_medida} {indice.descripcion}
                  </Typography>
                </Grid>

              </Grid>
              
          </Grid>

            </CardContent>
          </Card>
        </div>
        : null
      ))
      }
  </div>
  )

  return (
  <div> 
      <div></div>
    <Grid container spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
    >
      
      <Grid item xs={3}
      >
            <Card sx={{mt:1}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} >

                      <Grid container spacing={0.5}
                            direction="column"
                            //alignItems="center"
                            justifyContent="center"
                      >
                          <Typography color='white' marginTop="-1rem" >
                              {editando ? "MODIFICANDO DATOS DE VENTA " : "REGISTRANDO DATOS DE VENTA"}
                          </Typography>
                          
                          <FormControl fullWidth sx={{margin:'.5rem 0'}}>
                            <InputLabel id="demo-simple-select-label" 
                                              inputProps={{ style:{color:'white'} }}
                                              InputLabelProps={{ style:{color:'white'} }}
                                              sx={{mt:1, color:"green"}}
                            >Operacion</InputLabel>
                            <Select
                                    labelId="operacion_select"
                                    size="small"
                                    id={venta.tipo_op}
                                    value={venta.tipo_op}
                                    name="tipo_op"
                                    sx={{display:'block',
                                    margin:'.9rem 0', color:"white"}}
                                    label="Operacion"
                                    onChange={handleChange}
                                  >
                                    {   
                                        operacion_select.map(elemento => (
                                        <MenuItem key={elemento.tipo_op} value={elemento.tipo_op}>
                                          {elemento.tipo_op}
                                        </MenuItem>)) 
                                    }
                            </Select>
                          </FormControl>

                          {/* primera linea--------------------------------- */}
                          <FormControl fullWidth sx={{margin:'-1rem 0'}}>
                            <InputLabel id="demo-simple-select-label" 
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                        sx={{mt:1, color:"green"}}
                            >Zona</InputLabel>
                            <Select
                              labelId="zona_select"
                              size="small"
                              id={venta.id_zona_venta}
                              value={venta.id_zona_venta}
                              name="id_zona_venta"
                              sx={{display:'block',
                              margin:'.9rem 0', color:"white"}}
                              label="Zona"
                              onChange={handleChange}
                              inputProps={{ style:{color:'white'} }}
                              InputLabelProps={{ style:{color:'white'} }}
                            >
                              {   
                                  zona_select.map(elemento => (
                                  <MenuItem key={elemento.id_zona} 
                                            value={elemento.id_zona}
                                  >
                                    {elemento.nombre}
                                  </MenuItem>)) 
                              }
                            </Select>
                          </FormControl>

                          <TextField variant="outlined" 
                                    //label="fecha"
                                    fullWidth
                                    size="small"
                                    sx={{display:'block',
                                          margin:'.5rem 0'}}
                                    name="comprobante_original_fecemi"
                                    type="date"
                                    //format="yyyy/MM/dd"
                                    value={venta.comprobante_original_fecemi}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                          />
                          
                          <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth sx={{margin:'-0.5rem 0'}}>
                                    <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                                sx={{mt:1, color:"green"}}
                                    >Vendedor</InputLabel>
                                    <Select
                                      labelId="vendedor_select"
                                      size="small"
                                      id={venta.id_vendedor}
                                      value={venta.id_vendedor}
                                      name="id_vendedor"
                                      sx={{display:'block',
                                      margin:'.9rem 0', color:"white"}}
                                      label="Vendedor"
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                    >
                                      {   
                                          vendedor_select.map(elemento => (
                                          <MenuItem key={elemento.id_vendedor} value={elemento.id_vendedor}>
                                            {elemento.nombre}
                                          </MenuItem>)) 
                                      }
                                    </Select>
                                  </FormControl>
                          </Box>

                          <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                                sx={{mt:1, color:"green"}}
                                    >Cliente</InputLabel>
                                    <Select
                                      labelId="cliente_select"
                                      size="small"
                                      id={venta.documento_id}
                                      value={venta.documento_id}
                                      name="documento_id"
                                      sx={{display:'block',
                                      margin:'.5rem 0', color:"white"}}
                                      label="Cliente"
                                      onChange={handleChange}
                                    >
                                      {   
                                          cliente_select.map(elemento => (
                                          <MenuItem key={elemento.documento_id} value={elemento.documento_id}>
                                            {elemento.razon_social}
                                          </MenuItem>)) 
                                      }
                                    </Select>
                                  </FormControl>
                          </Box>
                          <Grid container spacing={0.5}>
                              <Grid item xs={10}>
                                <Button variant='contained' 
                                        color='primary' 
                                        type='submit'
                                        fullWidth
                                        sx={{display:'block',
                                        margin:'.5rem 0'}}
                                        disabled={
                                                  !venta.id_zona_venta || 
                                                  !venta.comprobante_original_fecemi || 
                                                  !venta.id_vendedor || 
                                                  !venta.documento_id
                                                  }
                                        >
                                        { cargando ? (
                                        <CircularProgress color="inherit" size={24} />
                                        ) : (
                                          editando ?
                                        'Modificar' : 'Grabar')
                                        }
                                </Button>
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                      sx={{margin:'.5rem 0'}}
                                      onClick = {()=> {
                                        //console.log(`/ventadet/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                        navigate(`/ventadet/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                                      }
                                      }
                                >
                                  <AddBoxRoundedIcon />
                                </IconButton>
                              </Grid>
                          </Grid>

                          {body}

                      </Grid>
                    </form>
                </CardContent>
            </Card>
      </Grid>

        
      

    </Grid>
  </div>    
  );
}
