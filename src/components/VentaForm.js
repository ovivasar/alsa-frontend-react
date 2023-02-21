import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl, Switch, FormControlLabel, Checkbox} from '@mui/material'
import { useState,useEffect,useCallback,useMemo } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import AddBoxRoundedIcon from '@mui/icons-material/AddToQueue';
import BorderColorIcon from '@mui/icons-material/EditRounded';
import FindIcon from '@mui/icons-material/FindInPage';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import IconButton from '@mui/material/IconButton';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import DateFnsUtils from '@date-io/date-fns';
import swal from 'sweetalert';

export default function VentaForm() {
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  //Select(Combos) para llenar, desde tabla
  const [operacion_select] = useState([
    {tipo_op:'VENTA'},
    {tipo_op:'TRANSBORDO'}
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
      await fetch(`http://localhost:4000/venta/${params.cod}/${params.serie}/${params.num}/${params.elem}`, {
        method: "PUT",
        body: JSON.stringify(venta),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      //console.log(venta);
      const res = await fetch("http://localhost:4000/venta", {
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
    .get('http://localhost:4000/zona')
    .then((response) => {
        setZonaSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaVendedorCombo = () =>{
    axios
    .get('http://localhost:4000/usuario/vendedores')
    .then((response) => {
        setVendedorSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaClienteCombo = () =>{
    axios
    .get('http://localhost:4000/correntista')
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
    const res = await fetch(`http://localhost:4000/venta/${cod}/${serie}/${num}/${elem}`);
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
    const res = await fetch(`http://localhost:4000/ventadet/${cod}/${serie}/${num}/${elem}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
    setEditando(true);
  };

  const eliminarVentaDetalleItem = async (cod,serie,num,elem,item) => {
    await fetch(`http://localhost:4000/ventadet/${cod}/${serie}/${num}/${elem}/${item}`, {
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

              <Grid container spacing={0.5}>

                  <Grid item xs={0.5}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> navigate(`/ventadet/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <BorderColorIcon />
                    </IconButton>
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> navigate(`/ventadettrans/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <LocalShippingIcon />
                    </IconButton>
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    <IconButton color="warning" aria-label="upload picture" component="label" size="small"
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
                        {indice.zona_entrega}
                      </Typography>
                  </Grid>
                  
                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.descripcion}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.precio_unitario}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.porc_igv}
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
        </div>
        : null
      ))
      }
  </div>
  )

  return (
  <div> 
      <div></div>
      <Grid item xs={12}
      >
            <Card sx={{mt:3}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  >
                <Typography variant='5' color='white' textAlign='center'>
                    {editando ? "EDITAR VENTA" : "REGISTRAR VENTA"}
                </Typography>
                
                <CardContent >
                    <form onSubmit={handleSubmit} >
                      <Grid container spacing={0.5}>
                          
                          <Grid item xs={1.8}>
                            <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                              >Operacion</InputLabel>
                              <Select
                                      labelId="operacion_select"
                                      id={venta.tipo_op}
                                      value={venta.tipo_op}
                                      name="tipo_op"
                                      sx={{display:'block',
                                      margin:'.5rem 0', color:"white"}}
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
                            </Box>
                          </Grid>

                          {/* primera linea--------------------------------- */}
                          <Grid item xs={2}>
                          <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                    >Zona</InputLabel>
                                    <Select
                                      labelId="zona_select"
                                      id={venta.id_zona_venta}
                                      value={venta.id_zona_venta}
                                      name="id_zona_venta"
                                      sx={{display:'block',
                                      margin:'.5rem 0', color:"white"}}
                                      label="Zona"
                                      onChange={handleChange}
                                      onClick = {  ()=>{
                                        //console.log(zona_select);
                                        //console.log(venta.id_zona_venta);
                                        //setVenta({...venta, zona_venta: elemento.nombre});
                                        //(event) => setVenta({zona_venta:event.target.value})
                                        }
                                      }
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
                          </Box>
                          </Grid>

                          <Grid item xs={2}>
                          <TextField variant="outlined" 
                                    //label="fecha"
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
                          </Grid>
                          
                          <Grid item xs={1.5}>
                          <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                    >Vendedor</InputLabel>
                                    <Select
                                      labelId="vendedor_select"
                                      id={venta.id_vendedor}
                                      value={venta.id_vendedor}
                                      name="id_vendedor"
                                      sx={{display:'block',
                                      margin:'.5rem 0', color:"white"}}
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
                          </Grid>

                          <Grid item xs={3.2}>
                          <Box sx={{ minWidth: 120 }}>
                                  <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label" 
                                                inputProps={{ style:{color:'white'} }}
                                                InputLabelProps={{ style:{color:'white'} }}
                                    >Cliente</InputLabel>
                                    <Select
                                      labelId="cliente_select"
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
                          </Grid>
                          
                          <Grid item xs={0.8}>
                              <Button variant='contained' 
                                      color='primary' 
                                      type='submit'
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
            //key={ registrosdet.length? registrosdet.ref_documento_id : '0'}
            key={registrosdet.ref_documento_id}
      >
          <CardContent style={{color:'#4264EE'}}>

              <Grid container spacing={0.5}>

                  <Grid item xs={0.5}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> {
                                  //console.log(`/ventadet/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                  navigate(`/ventadet/${venta.comprobante_original_codigo}/${venta.comprobante_original_serie}/${venta.comprobante_original_numero}/${venta.elemento}/${venta.comprobante_original_fecemi}/new`);
                                                }
                                }
                    >
                      <AddBoxRoundedIcon />
                    </IconButton>
                    
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    {registrosdet.length}
                  </Grid>
                  <Grid item xs={1.5}>
                    RUC
                  </Grid>
                  <Grid item xs={2}>
                    RAZON SOCIAL
                  </Grid>
                  <Grid item xs={1}>
                    ENTREGA
                  </Grid>
                  <Grid item xs={1}>
                    PRODUCTO
                  </Grid>
                  <Grid item xs={1}>
                    P.UNIT $
                  </Grid>
                  <Grid item xs={1}>
                    % IGV
                  </Grid>
                  <Grid item xs={1}>
                    TN.
                  </Grid>
                  <Grid item xs={2}>
                    OBSERVACIONES
                  </Grid>
              </Grid>
          </CardContent>
      </Card>

      {body}


  </div>    
  );
}
