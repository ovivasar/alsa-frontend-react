import {Grid,Card,CardContent,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
import { useState,useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import FindIcon from '@mui/icons-material/FindInPage';
import IconButton from '@mui/material/IconButton';
import React from 'react';

import CheckIcon from '@mui/icons-material/CheckOutlined';
import ToggleButton from '@mui/material/ToggleButton';

export default function VentaFormDet() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  

  //experimento
  const [unidad_select] = useState([
    {unidad_medida:'TNE'},
    {unidad_medida:'BLS'}
  ]);
  const [moneda_select] = useState([
    {moneda:'S/'},
    {moneda:'USD'}
  ]);

  const [cond_venta_select] = useState([
    {cond_venta:'PESO LLEGADA'},
    {cond_venta:'PESO PARTIDA'}
  ]);
  const [cond_entrega_select] = useState([
    {cond_entrega:'PUESTO EN ALMACEN'},
    {cond_entrega:'RECOGIDO POR CLIENTE'}
  ]);

  const [updateTrigger, setUpdateTrigger] = useState({});
  const [razonSocialBusca, setRazonSocialBusca] = useState("");
    //funcion para mostrar data de formulario, modo edicion
  const mostrarRazonSocialBusca = async (documento_id) => {
      const res = await fetch(`https://apiperu.dev/api/ruc/${documento_id}`, {
        method: "GET",
        headers: {"Content-Type":"application/json",
                  "Authorization": "Bearer " + "f03875f81da6f2c2f2e29f48fdf798f15b7a2811893ad61a1e97934a665acc8b"
                  }
      });

      const datosjson = await res.json();
      //console.log(datosjson);
      //console.log(datosjson.data.nombre_o_razon_social);
      setRazonSocialBusca(datosjson.data.nombre_o_razon_social);
      ventaDet.ref_razon_social = datosjson.data.nombre_o_razon_social;
  };
  
  /*let txtRazonSocialRef = useRef();
  function razonSocialFocus(){
    const input =  txtRazonSocialRef.current;
    input.focus();
  }*/
  ////////////////////////////////////////////////////////////////////////////////////////

  //Select(Combos) para llenar, desde tabla
  const [zonaentrega_select,setZonaEntregaSelect] = useState([]);
  const [producto_select,setProductoSelect] = useState([]);
  const [formapago_select,setFormaPagoSelect] = useState([]);
  const [igvselected, setIgvSelected] = useState(true);
  
  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  //const fecha_actual = new Date();

  //Para guardado de datos antes de envio 
  //Falta aumentar la fecha desde el parametro
  const [ventaDet,setVentaDet] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      comprobante_original_codigo:params.cod,
      comprobante_original_serie:params.serie,
      comprobante_original_numero:params.num,
      comprobante_original_fecemi:params.fecha,
      elemento:params.elem,
      item:params.item,
      ref_documento_id:'',  
      ref_razon_social:'',  
      ref_direccion:'',   
      unidad_medida:'TNE',   //new
      id_zona_entrega:'',
      zona_entrega:'',
      id_formapago:'', 
      formapago:'',   
      cond_venta:'',  
      cond_entrega:'', 
      fecha_entrega2:'', 
      id_producto:'',
      descripcion:'',
      precio_unitario:'',
      porc_igv:'18',
      moneda:'USD',//new
      cantidad:'',
      peso_neto:'0',
      ref_observacion:'-',
      registrado:'1'
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      await fetch(`${back_host}/ventadet/${params.cod}/${params.serie}/${params.num}/${params.elem}/${params.item}`, {
        method: "PUT",
        body: JSON.stringify(ventaDet),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log(ventaDet);
      await fetch(`${back_host}/ventadet`, {
        method: "POST",
        body: JSON.stringify(ventaDet),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    
    setEditando(true);
    setUpdateTrigger(Math.random());//experimento
    navigate(`/venta/${params.cod}/${params.serie}/${params.num}/${params.elem}/edit`);
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.cod){
      mostrarVenta(params.cod,params.serie,params.num,params.elem,params.item);
    }  
    
    cargaZonaEntregaCombo();
    cargaProductoCombo();
    cargaFormaPagoCombo();

    //console.log(fecha_actual);
  },[params.cod, updateTrigger]);

  const cargaZonaEntregaCombo = () =>{
    axios
    .get(`${back_host}/zonadet`)
    .then((response) => {
        setZonaEntregaSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaProductoCombo = () =>{
    axios
    .get(`${back_host}/producto`)
    .then((response) => {
        setProductoSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }
  const cargaFormaPagoCombo = () =>{
    axios
    .get(`${back_host}/formapago`)
    .then((response) => {
        setFormaPagoSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  }

  //Rico evento change
  const handleChange = e => {
    var index;
    var sTexto;
    if (e.target.name === "id_zona_entrega") {
      const arrayCopia = zonaentrega_select.slice();
      index = arrayCopia.map(elemento => elemento.id_zonadet).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVentaDet({...ventaDet, [e.target.name]: e.target.value, zona_entrega:sTexto});
      return;
    }
    if (e.target.name === "id_producto") {
      const arrayCopia = producto_select.slice();
      index = arrayCopia.map(elemento => elemento.id_producto).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVentaDet({...ventaDet, [e.target.name]: e.target.value, descripcion:sTexto});
      return;
    }
    if (e.target.name === "id_formapago") {
      const arrayCopia = formapago_select.slice();
      index = arrayCopia.map(elemento => elemento.id_formapago).indexOf(e.target.value);
      sTexto = arrayCopia[index].nombre;
      setVentaDet({...ventaDet, [e.target.name]: e.target.value, formapago:sTexto});
      return;
    }

    //Para todos los demas casos ;)
    setVentaDet({...ventaDet, [e.target.name]: e.target.value});
  }

  const mostrarIgvProducto = async (cod) => {
    const res = await fetch(`${back_host}/productoigv/${cod}`);
    const datosjson = await res.json();
    console.log(datosjson);
    ventaDet.porc_igv = datosjson.porc_igv;
    console.log(ventaDet.porc_igv);
  };

  //funcion para mostrar data de formulario, modo edicion
  const mostrarVenta = async (cod,serie,num,elem,item) => {
    console.log(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}/${item}`);
    const res = await fetch(`${back_host}/ventadet/${cod}/${serie}/${num}/${elem}/${item}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setVentaDet({  
                ref_documento_id:data.ref_documento_id,  
                ref_razon_social:data.ref_razon_social,  
                ref_direccion:data.ref_direccion,  
                unidad_medida:data.unidad_medida,  
                id_zona_entrega:data.id_zona_entrega,
                zona_entrega:data.zona_entrega,
                id_formapago:data.id_formapago, //new
                formapago:data.formapago,       //new
                cond_venta:data.cond_venta,       //new
                cond_entrega:data.cond_entrega,   //new
                fecha_entrega2:data.fecha_entrega2,   //new
                moneda:data.moneda,   //new
                id_producto:data.id_producto,
                descripcion:data.descripcion,
                precio_unitario:data.precio_unitario,
                porc_igv:data.porc_igv,
                cantidad:data.cantidad,
                peso_neto:data.peso_neto,
                ref_observacion:data.ref_observacion,
                registrado:data.registrado
              });
    //console.log(data);
    setEditando(true);
  };
  
  return (
    <> 

    <Grid container spacing={1}
          direction="column"
          alignItems="center"
          justifyContent="center"
    >
        <Grid item xs={3}>
            <Card sx={{mt:2}}
                  //sx={{ minWidth: 275 }}            
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  //hidden={!editando}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} autoComplete="off">

                    <Grid container spacing={0.5}>
                        <Grid item xs={4}>
                            <TextField variant="outlined" 
                                      label="RUC FACT."
                                      //size="small"
                                      //sx={{display:'block',
                                      //      margin:'.5rem 0'}}
                                      sx={{mt:-1}}
                                      name="ref_documento_id"
                                      value={ventaDet.ref_documento_id}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',width: 140} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                              //sx={{display:'block',
                              //margin:'1rem 0'}}
                              sx={{mt:-1}}
                              onClick = { () => {
                                  ventaDet.ref_razon_social = "";
                                  mostrarRazonSocialBusca(ventaDet.ref_documento_id);
                                  //ventaDet.porc_igv = "";
                                  //mostrarIgvProducto(ventaDet.id_producto);
                                }
                              }
                            >
                              <FindIcon />
                            </IconButton>
                        </Grid>

                    </Grid>
                    
                            <TextField variant="outlined" 
                                      label="RAZON SOCIAL FACT."
                                      fullWidth
                                      //size="small"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_razon_social"
                                      //ref={txtRazonSocialRef} //para el rico foco solo con input funciona
                                      value={ventaDet.ref_razon_social || razonSocialBusca}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />
                            <TextField variant="outlined" 
                                      label="DIR. LLEGADA"
                                      fullWidth
                                      //size="small"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_direccion"
                                      value={ventaDet.ref_direccion}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'left'} }}
                                      InputLabelProps={{ style:{color:'white'}
                                    }}
                            />

                            <Box sx={{ minWidth: 120 }}
                                 // sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                                  sx={{mt:1, color:'#5DADE2'}}
                                      >LUGAR LLEGADA [ SEL.]</InputLabel>
                                      <Select
                                        labelId="zona_entrega"
                                        id={ventaDet.id_zona_entrega}
                                        value={ventaDet.id_zona_entrega}
                                        name="id_zona_entrega"
                                        size="small"
                                        sx={{display:'block',
                                        margin:'.5rem 0' , color:"white"}}
                                        label="Zona Entrega"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            zonaentrega_select.map(elemento => (
                                            <MenuItem key={elemento.id_zonadet} 
                                                      value={elemento.id_zonadet}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{ minWidth: 120 }}
                                   //sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                                  sx={{mt:1, color:'#5DADE2'}}
                                      >PRODUCTO [ SEL.]</InputLabel>
                                      <Select
                                        labelId="producto"
                                        id={ventaDet.id_producto}
                                        value={ventaDet.id_producto}
                                        name="id_producto"
                                        size="small"
                                        sx={{display:'block',
                                        margin:'.5rem 0' , color:"white"}}
                                        label="Producto Lote"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            producto_select.map(elemento => (
                                            <MenuItem   key={elemento.id_producto} 
                                                        value={elemento.id_producto}
                                            >
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Grid container spacing={0.5}

                            >
                                <Grid item xs={7}>
                                    <TextField variant="filled" 
                                          label="P.UNIT"
                                          size="small"
                                          fullWidth
                                          sx={{display:'block',
                                                margin:'.5rem 0'}}
                                          //sx={{mt:-3}}
                                          name="precio_unitario"
                                          value={ventaDet.precio_unitario}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center', fontSize: "1.5rem"} }}
                                          InputLabelProps={{ style:{color:'white'}
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={2}>
                                        <Box sx={{mt:0}}>
                                                <FormControl fullWidth>
                                                  <InputLabel id="demo-simple-select-label" 
                                                                    inputProps={{ style:{color:'white'} }}
                                                                    InputLabelProps={{ style:{color:'white'} }}
                                                                    sx={{mt:1, color:'#5DADE2'}}
                                                  >DIV</InputLabel>
                                                  <Select
                                                          labelId="moneda_select"
                                                          id={ventaDet.moneda}
                                                          value={ventaDet.moneda}
                                                          name="moneda"
                                                          size="normal"
                                                          sx={{display:'block',
                                                          margin:'.75rem', color:"white"}}
                                                          onChange={handleChange}
                                                        >
                                                          {   
                                                              moneda_select.map(elemento => (
                                                              <MenuItem key={elemento.moneda} value={elemento.moneda}>
                                                                {elemento.moneda}
                                                              </MenuItem>)) 
                                                          }
                                                  </Select>
                                                </FormControl>
                                        </Box>
                                </Grid>

                                <Grid item xs={1}>
                                    <ToggleButton
                                        value="check"
                                        sx={{display:'block',
                                        margin:'.8rem 0'}}
                                        selected={igvselected}
                                        onChange={() => {
                                          setIgvSelected(!igvselected);
                                          if (igvselected){
                                            ventaDet.porc_igv=18;
                                          }else{
                                            ventaDet.porc_igv=0;
                                          }
                                          //console.log(igvselected);
                                          //console.log(ventaDet.porc_igv);
                                        }}
                                      >
                                        <CheckIcon color="warning"/>
                                    </ToggleButton>
                                </Grid>

                                <Grid item xs={2}>
                                    <TextField variant="filled" 
                                          label="% IGV"
                                          size="normal"
                                          sx={{display:'block',margin:'.75rem 0'}}
                                          //sx={{mt:-3}}
                                          name="porc_igv"
                                          value={ventaDet.porc_igv}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={0.5}>

                                  <Grid item xs={9}>
                                    <TextField variant="filled" 
                                                  label="CANT."
                                                  size="small"
                                                  fullWidth
                                                  sx={{display:'block',
                                                        margin:'.5rem 0'}}
                                                  //sx={{mt:-3}}
                                                  name="cantidad"
                                                  value={ventaDet.cantidad}
                                                  onChange={handleChange}
                                                  inputProps={{ style:{color:'white',textAlign: 'center', fontSize: "1.5rem"} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                    />
                                </Grid>
                                
                                <Grid item xs={3}>
                                        <Box sx={{mt:0}}>
                                                <FormControl fullWidth>
                                                  <InputLabel id="demo-simple-select-label" 
                                                                    inputProps={{ style:{color:'white'} }}
                                                                    InputLabelProps={{ style:{color:'white'} }}
                                                                    sx={{mt:1, color:'#5DADE2'}}
                                                  >UND.</InputLabel>
                                                  <Select
                                                          labelId="unidad_select"
                                                          id={ventaDet.unidad_medida}
                                                          value={ventaDet.unidad_medida}
                                                          name="unidad_medida"
                                                          size="normal"
                                                          sx={{display:'block',
                                                          margin:'.75rem', color:"white"}}
                                                          label="Unidad"
                                                          onChange={handleChange}
                                                        >
                                                          {   
                                                              unidad_select.map(elemento => (
                                                              <MenuItem key={elemento.unidad_medida} value={elemento.unidad_medida}>
                                                                {elemento.unidad_medida}
                                                              </MenuItem>)) 
                                                          }
                                                  </Select>
                                                </FormControl>
                                        </Box>
                                </Grid>

                            </Grid>

                            <Box sx={{ minWidth: 120 }}
                                   //sx={{mt:-3}}
                            >
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                  inputProps={{ style:{color:'white'} }}
                                                  InputLabelProps={{ style:{color:'white'} }}
                                                  sx={{mt:1, color:'#5DADE2'}}
                                      >COND. PAGO [ SEL.]</InputLabel>
                                      <Select
                                        labelId="producto"
                                        id={ventaDet.id_formapago}
                                        value={ventaDet.id_formapago}
                                        name="id_formapago"
                                        size="small"
                                        sx={{display:'block',
                                        margin:'.5rem 0', color:"white"}}
                                        label="Forma Pago"
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                      >
                                        {   
                                            formapago_select.map(elemento => (
                                            <MenuItem   key={elemento.id_formapago} 
                                                        value={elemento.id_formapago}>
                                              {elemento.nombre}
                                            </MenuItem>)) 
                                        }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{mt:1}}>
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                        inputProps={{ style:{color:'white'} }}
                                                        InputLabelProps={{ style:{color:'white'} }}
                                                        sx={{mt:1, color:'#5DADE2'}}
                                      >COND. VENTA [ SEL.]</InputLabel>
                                      <Select
                                              labelId="cond_venta_select"
                                              id={ventaDet.cond_venta}
                                              value={ventaDet.cond_venta}
                                              name="cond_venta"
                                              size="small"
                                              sx={{display:'block',
                                              margin:'.1rem', color:"white"}}
                                              label="Condicion Venta"
                                              onChange={handleChange}
                                            >
                                              {   
                                                  cond_venta_select.map(elemento => (
                                                  <MenuItem key={elemento.cond_venta} value={elemento.cond_venta}>
                                                    {elemento.cond_venta}
                                                  </MenuItem>)) 
                                              }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <Box sx={{mt:1}}>
                                    <FormControl fullWidth>
                                      <InputLabel id="demo-simple-select-label" 
                                                        inputProps={{ style:{color:'white'} }}
                                                        InputLabelProps={{ style:{color:'white'} }}
                                                        sx={{mt:1, color:'#5DADE2'}}
                                      >COND. ENTREGA [ SEL.]</InputLabel>
                                      <Select
                                              labelId="cond_entrega_select"
                                              id={ventaDet.cond_entrega}
                                              value={ventaDet.cond_entrega}
                                              name="cond_entrega"
                                              size="small"
                                              sx={{display:'block',
                                              margin:'.1rem', color:"white"}}
                                              label="Condicion Entrega"
                                              onChange={handleChange}
                                            >
                                              {   
                                                  cond_entrega_select.map(elemento => (
                                                  <MenuItem key={elemento.cond_entrega} value={elemento.cond_entrega}>
                                                    {elemento.cond_entrega}
                                                  </MenuItem>)) 
                                              }
                                      </Select>
                                    </FormControl>
                            </Box>

                            <TextField variant="filled" 
                                      label="Observaciones"
                                      fullWidth
                                      size="small"
                                      sx={{display:'block',
                                            margin:'.5rem 0'}}
                                      //sx={{mt:-3}}
                                      name="ref_observacion"
                                      value={ventaDet.ref_observacion}
                                      onChange={handleChange}
                                      inputProps={{ style:{color:'white',textAlign: 'left'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                            />

                            <TextField variant="outlined" 
                                        label="Fecha Entrega"
                                        fullWidth
                                        sx={{mt:0,margin:'.5rem 0'}}
                                        name="fecha_entrega2"
                                        type="date"
                                        //format="yyyy/MM/dd"
                                        value={ventaDet.fecha_entrega2}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                            />

                            <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:1}}
                                    type='submit'
                                    disabled={!ventaDet.cantidad || 
                                              !ventaDet.precio_unitario ||
                                              !ventaDet.ref_documento_id ||
                                              !ventaDet.ref_razon_social ||
                                              !ventaDet.ref_direccion ||
                                              !ventaDet.id_producto 
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('AGREGAR')
                                    }
                            </Button>

                            <Button variant='contained' 
                                    color='success' 
                                    sx={{mt:1}}
                                    onClick={ ()=>{
                                      navigate(-1, { replace: true });
                                      //window.location.reload();
                                      }
                                    }
                                    >
                              ANTERIOR
                            </Button>


                    </form>
                </CardContent>
            </Card>
            
        </Grid>
        

    </Grid>

    </>    
  )
}
