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

import DateFnsUtils from '@date-io/date-fns';
import swal from 'sweetalert';

export default function OCargaForm() {
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  //Select(Combos) para llenar, desde tabla
  const [operacion_select] = useState([
    {tipo_op:'VENTA'},
    {tipo_op:'TRANSBORDO'}
  ]);

  const [zona_select,setZonaSelect] = useState([]);
  const [cliente_select,setClienteSelect] = useState([]);

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
      mostrarOCarga(params.ano,params.numero);
      mostrarOCargaDetalle(params.ano,params.numero);
    }
    cargaZonaCombo();
    cargaClienteCombo();
    
  },[params.numero]);

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
      setOCarga({...ocarga, [e.target.name]: e.target.value, zona_venta:sTexto});
      return;
    }
    if (e.target.name === "documento_id") {
      const arrayCopia = cliente_select.slice();
      index = arrayCopia.map(elemento => elemento.documento_id).indexOf(e.target.value);
      sTexto = arrayCopia[index].razon_social;
      setOCarga({...ocarga, [e.target.name]: e.target.value, razon_social:sTexto});
      return;
    }

    setOCarga({...ocarga, [e.target.name]: e.target.value});
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarOCarga = async (ano,numero) => {
    const res = await fetch(`http://localhost:4000/ocarga/${ano}/${numero}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setOCarga({  
                fecha:data.fecha,
                numero:data.numero,
                registrado:data.registrado
              });
    //console.log(data);
    setEditando(true);
  };
  
  const mostrarOCargaDetalle = async (ano,numero) => {
    const res = await fetch(`http://localhost:4000/ocargadet/${ano}/${numero}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
    console.log(registrosdet.length);
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
                                    name="comprobante_original_fecemi"
                                    type="date"
                                    //format="yyyy/MM/dd"
                                    value={ocarga.comprobante_original_fecemi}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                          />
                          </Grid>
                          
                          <Grid item xs={1.5}>
                            <TextField variant="outlined" 
                                        label="ORDEN"
                                        sx={{display:'block',
                                                margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="cantidad"
                                        value={ocarga.cantidad}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />
                          </Grid>

                          
                          <Grid item xs={0.8}>
                              <Button variant='contained' 
                                      color='primary' 
                                      type='submit'
                                      sx={{display:'block',
                                      margin:'.5rem 0'}}
                                      disabled={
                                                !ocarga.id_zona_venta || 
                                                !ocarga.comprobante_original_fecemi || 
                                                !ocarga.documento_id
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
            key={registrosdet.ref_documento_id}
            >
          
          <CardContent style={{color:'#4264EE'}}>

              <Grid container spacing={0.5}>

                  <Grid item xs={0.5}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> {
                                  navigate(`/ventadet/${ocarga.comprobante_original_codigo}/${ocarga.comprobante_original_serie}/${ocarga.comprobante_original_numero}/${ocarga.elemento}/${ocarga.comprobante_original_fecemi}/new`);
                                                }
                                }
                    >
                      <AddBoxRoundedIcon />
                    </IconButton>
                    
                  </Grid>
                  
                  <Grid item xs={0.5}>
                    -
                  </Grid>

                  <Grid item xs={1}>
                    PEDIDO
                  </Grid>

                  <Grid item xs={1}>
                    ZONA
                  </Grid>

                  <Grid item xs={1}>
                    GUIA
                  </Grid>

                  <Grid item xs={1}>
                    OPERACION
                  </Grid>

                  <Grid item xs={1}>
                    TICKET
                  </Grid>
                  
                  <Grid item xs={1}>
                    PRODUCTO
                  </Grid>

                  <Grid item xs={1}>
                    CLIENTE
                  </Grid>

                  <Grid item xs={1}>
                    SACOS
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
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> navigate(`/ventadet/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <BorderColorIcon />
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

                  <Grid item xs={0.5}>
                    <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                                onClick = {()=> navigate(`/ventadet/${indice.comprobante_original_codigo}/${indice.comprobante_original_serie}/${indice.comprobante_original_numero}/${indice.elemento}/${indice.item}/edit`)}
                    >
                      <GroupsIcon />
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


      ))
    }


  </>    
  );
}
