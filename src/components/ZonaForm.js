import {Grid,Card,CardContent,Typography,TextField,Button, CircularProgress} from '@mui/material'
//import { padding } from '@mui/system'
import { useState,useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';

export default function ZonaForm() {
  
  const [zona,setZona] = useState({
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
      await fetch(`http://localhost:4000/zona/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(zona),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      await fetch("http://localhost:4000/zona", {
        method: "POST",
        body: JSON.stringify(zona),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    navigate("/");
    
    //console.log(zona);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.id){
      mostrarZona(params.id);
    }  
  },[params.id]);

  //Rico evento change
  const handleChange = e => {
    setZona({...zona, [e.target.name]: e.target.value});
    //console.log(e.target.name, e.target.value);
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarZona = async (id) => {
    const res = await fetch(`http://localhost:4000/zona/${id}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setZona({nombre:data.nombre, descripcion:data.descripcion, siglas:data.siglas});
    //console.log(data);
    //console.log(data.nombre);
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
                    {editando ? "EDITAR ZONA" : "CREAR ZONA"}
                </Typography>
                <CardContent>
                    <form onSubmit={handleSubmit} >
                        <TextField variant="filled" 
                                   label="nombre"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="nombre"
                                   value={zona.nombre}
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
                                   value={zona.descripcion}
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
                                   value={zona.siglas}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />
                        <Button variant='contained' 
                                color='primary' 
                                type='submit'
                                disabled={!zona.nombre || 
                                          !zona.descripcion || 
                                          !zona.siglas}
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
