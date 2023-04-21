import {Grid,Card,CardContent,TextField,Button,CircularProgress, Typography} from '@mui/material'
import { useState,useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import React from 'react';

export default function OCargaFormTraslado() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //experimento
  const [updateTrigger, setUpdateTrigger] = useState({});
  ////////////////////////////////////////////////////////////////////////////////////////
  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  const [ePeso, setEPeso] = useState('');

  const navigate = useNavigate();
  const params = useParams();

  //Para guardado de datos antes de envio 
  //Falta aumentar la fecha desde el parametro
  const [ocargaDet,setocargaDet] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      fecha2:'',
      
      ano:'',
      numero:'',
      item:'',
      
      pedido:'',  //ventas: ref_cod, ref_serie, ref_numero, item
      id_producto:'',   //ventas
      descripcion:'',   //ventas
      unidad_medida:'',   //ventas
      cantidad:'',      //ventas
      operacion:'DESCARGUIO',     //ocarga-fase01

      ticket_tras:'',       //new
      peso_ticket_tras:'',  //new
      sacos_ticket_tras:'', //new

      registrado:'1'
  })

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
        
        console.log("actualizando");
        //backend: actualizarOCargaTicketTraslado
        await fetch(`${back_host}/ocargatickettraslado/${params.ano}/${params.numero}/${params.item}`, {
          method: "PUT",
          body: JSON.stringify(ocargaDet),
          //headers: {'Access-Control-Allow-Origin': '*','Content-Type':'application/json'}
          headers: {'Content-Type':'application/json'}
        });
        
        
        //console.log(ocargaDet);
        //actualizar cantidad a grabar
        const cant_nueva = (ePeso - ocargaDet.cantidad).toFixed(2);
        //console.log(cant_nueva);
        ocargaDet.cantidad = cant_nueva;
        //console.log(ocargaDet.cantidad);

        //Agregar orden detalle (con referencia de numero carga)
        console.log("agregando adicional version traslado");
        await fetch(`${back_host}/ocargatickettrasladoadd`, {
            method: "POST",
            body: JSON.stringify(ocargaDet),
            headers: {"Content-Type":"application/json"}
        });

    }else{
        
        //console.log(ocargaDet);
        //Agregar orden detalle (con referencia de numero carga)
        //console.log("agregando adicional");
        await fetch(`${back_host}/ocargadetadd`, {
            method: "POST",
            body: JSON.stringify(ocargaDet),
            headers: {"Content-Type":"application/json"}
        });
    }

    setCargando(false);
    
    setEditando(true);
    setUpdateTrigger(Math.random());//experimento
    //navigate(`/ocargadet/${params.fecha_proceso}`);
    window.history.back();
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    //Si tiene parametros, es editar (o clonar)
    //if (params.modo){
      mostrarOCarga(params.ano,params.numero,params.item);
      //Luego se establece editando = true
    //}  
    
    //console.log(fecha_actual);
  },[params.ano, updateTrigger]);

  const handleEPesoChange = (event) => {
    setEPeso(event.target.value); //almacena valor ePeso para uso posterior
    setocargaDet({...ocargaDet, peso_ticket_tras: event.target.value});

    //const cant_nueva = (event.target.value - ocargaDet.cantidad).toFixed(2);
    //setocargaDet({...ocargaDet, cantidad: cant_nueva});
  };
  
  //Rico evento change
  const handleChange = e => {
    //Para todos los demas casos ;)
    setocargaDet({...ocargaDet, [e.target.name]: e.target.value.toUpperCase()});
    //ocargaDet.cantidad = ocargaDet.peso_ticket_tras - ocargaDet.cantidad;
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarOCarga = async (ano,numero,item) => {
    const res = await fetch(`${back_host}/ocargadet/${ano}/${numero}/${item}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setocargaDet({  
                ano:params.ano,
                numero:params.numero,
                item:params.item,
                });

    setocargaDet({                  

                id_empresa:data.id_empresa,
                id_punto_venta:data.id_punto_venta,
                numero:data.numero,
                fecha2:data.fecha2,

                id_producto:data.id_producto,
                descripcion:data.descripcion,
                cantidad:data.cantidad,  //restar de la variable formulario, al momento de insertar
                unidad_medida:data.unidad_medida, //new

                operacion:'DESCARGUIO',   //datos adicionales
                ticket_tras:data.ticket_tras, //datos adicionales
                peso_ticket_tras:data.peso_ticket_tras, //datos adicionales
                sacos_ticket_tras:data.sacos_ticket_tras, //datos adicionales

                registrado:data.registrado

                });
    //console.log(data);

    setEditando(true);
  };


  return (
    <> 
<div class="p-3 mb-2 bg-dark text-white">

<Grid container spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
    >

  <Grid item xs={10}>

            <Card sx={{mt:2}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  //hidden={!editando}
                  >
                
                <CardContent >
                    <form onSubmit={handleSubmit} autoComplete="off">

                            <Grid container spacing={0.5}
                                      direction="column"
                                      //alignItems="center"
                                      justifyContent="center"
                            >
                                <Typography fontSize={15} marginTop="0.5rem" 
                                style={{color:'#F39C12'}}
                                >
                                DATOS DE TRASLADO
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                {ocargaDet.descripcion}
                                </Typography>

                                <Typography marginTop="0.5rem" variant="subtitle" 
                                style={{color:'#4F8FE1'}}
                                sx={{mt:0}}
                                >
                                UNIDAD : {ocargaDet.unidad_medida}
                                </Typography>

                               <TextField variant="outlined" 
                                      label="TICK TRASLADO"
                                      //sx={{mt:2}}
                                      sx={{ mt:2,
                                        typography: (theme) => ({
                                          fontSize: 5,
                                        }),
                                      }}                                      
                                      fullWidth
                                      name="ticket_tras"
                                      value={ocargaDet.ticket_tras}
                                      onChange={handleChange}
                                      //inputProps={{ style:{color:'white'} }}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                      label="TN."
                                      fullWidth
                                      sx={{mt:0}}
                                      name="peso_ticket_tras"
                                      value={ocargaDet.peso_ticket_tras}
                                      onChange={handleEPesoChange}
                                      //inputProps={{ style:{color:'white'} }}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <TextField variant="outlined" 
                                      label="SACOS"
                                      fullWidth
                                      sx={{mt:0}}
                                      name="sacos_ticket_tras"
                                      value={ocargaDet.sacos_ticket_tras}
                                      onChange={handleChange}
                                      //inputProps={{ style:{color:'white'} }}
                                      inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                      InputLabelProps={{ style:{color:'white'} }}
                                />

                                <Button variant='contained' 
                                    color='primary' 
                                    sx={{mt:1}}
                                    type='submit'
                                    disabled={!ocargaDet.ticket_tras || 
                                              !ocargaDet.peso_ticket_tras ||
                                              !ocargaDet.sacos_ticket_tras || !ePeso
                                              }
                                    >
                                    { cargando ? (
                                    <CircularProgress color="inherit" size={24} />
                                    ) : ('GRABAR')
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


                            </Grid>
                    </form>
                </CardContent>
            </Card>

  </Grid>      

</Grid>

</div>
    </>    
  )
}
