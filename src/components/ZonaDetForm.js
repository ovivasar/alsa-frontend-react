import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl} from '@mui/material'
//import { padding } from '@mui/system'
import {useState,useEffect} from 'react';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

export default function ZonaDetForm() {
    
  //Orden directa
  
  const [zonas_select,setZonaSelect] = useState([]);
  
  /*const zonas_select=[
    {id_zona:"01",nombre:"aqp"},
    {id_zona:"02",nombre:"lima"},
  ];*/

  const [zonadet,setZonaDet] = useState({
      id_zona:'',
      nombre:'',
      descripcion:'',
      siglas:''
  })

  const [cargando,setCargando] = useState(false);
  const [editando,setEditando] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();

  const handleSubmit = async(e) => {
    e.preventDefault();
    setCargando(true);
    
    //Cambiooo para controlar Edicion
    if (editando){
      console.log(`http://localhost:4000/zonadet/${params.id}`);
      console.log(zonadet);
      await fetch(`http://localhost:4000/zonadet/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(zonadet),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      //console.log(`http://localhost:4000/zonadet/${params.id}`);
      await fetch("http://localhost:4000/zonadet", {
        method: "POST",
        body: JSON.stringify(zonadet),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    navigate(`/zonadet`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.id){
      mostrarZonaDet(params.id);
    }
    axios
    .get('http://localhost:4000/zona')
    .then((response) => {
        console.log(response.data);
        //this.setState({zonas_select: response.data})
        setZonaSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  },[params.id]);

  //Rico evento change
  const handleChange = e => {
    setZonaDet({...zonadet, [e.target.name]: e.target.value});
    //console.log(e.target.name, e.target.value);
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarZonaDet = async (id) => {
    console.log(`http://localhost:4000/zonadet/${id}`);
    const res = await fetch(`http://localhost:4000/zonadet/${id}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setZonaDet({id_zona:data.id_zona, nombre:data.nombre, descripcion:data.descripcion, siglas:data.siglas});
    //console.log(data);
    //console.log(data.siglas);
    setEditando(true);
  };

  return (
    <Grid container
          direction="column"
          alignItems="center"
          justifyContent="center">
        <Grid item xs={3}>
            <Card sx={{mt:5}}
                  style={{
                    background:'#1e272e',
                    padding:'1rem'
                  }}
                  >
                <Typography variant='5' color='white' textAlign='center'>
                    {editando ? "EDITAR DESTINO" : "CREAR DESTINO"}
                </Typography>
                <CardContent>
                    <form onSubmit={handleSubmit} >
                        <TextField variant="filled" 
                                   label="nombre"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="nombre"
                                   value={zonadet.nombre}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                        />
                        <TextField variant="filled" 
                                   label="descripcion"
                                   multiline
                                   rows={2}
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="descripcion"
                                   value={zonadet.descripcion}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />
                        <TextField variant="filled" 
                                   label="siglas"
                                   multiline
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="siglas"
                                   value={zonadet.siglas}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />

      
                          <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label" 
                                              inputProps={{ style:{color:'white'} }}
                                              InputLabelProps={{ style:{color:'white'} }}
                                  >Zona</InputLabel>
                                  <Select
                                    labelId="zonas_select"
                                    id={zonadet.id_zona}
                                    value={zonadet.id_zona}
                                    name="id_zona"
                                    sx={{display:'block',
                                    margin:'.5rem 0'}}
                                    label="Zona"
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                                  >
                                    {   
                                        zonas_select.map(elemento => (
                                        <MenuItem key={elemento.id_zona} value={elemento.id_zona}>
                                          {elemento.nombre}
                                        </MenuItem>)) 
                                    }
                                  </Select>
                                </FormControl>
                              </Box>

                        <Button variant='contained' 
                                color='primary' 
                                type='submit'
                                disabled={!zonadet.nombre || 
                                          !zonadet.descripcion || 
                                          !zonadet.siglas}
                                >
                                { cargando ? (
                                <CircularProgress color="inherit" size={24} />
                                ) : (
                                  editando ?
                                'Modificar' : 'Grabar')
                                }
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
  )
}
