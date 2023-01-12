import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl, Switch, FormControlLabel, Checkbox} from '@mui/material'
//import { padding } from '@mui/system'
import {useState,useEffect} from 'react';
import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';

export default function CorrentistaForm() {
    
  //Select(Combos) para llenar, desde tabla
  const [vendedor_select,setVendedorSelect] = useState([]);
  
  /*const documento_select=[
    {id_documento:"01",nombre:"DNI"},
    {id_documento:"04",nombre:"CARNET EXTRANJERIA"},
    {id_documento:"06",nombre:"RUC"},
  ];*/
  
  //Estado para variables del formulario
  const [correntista,setCorrentista] = useState({
      id_documento:'',
      razon_social:'',
      contacto:'',
      telefono:'',
      email:'',
      id_vendedor:'',
      relacionado:'',
      base:''
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
      console.log(`http://localhost:4000/correntista/${params.id}`);
      console.log(correntista);
      await fetch(`http://localhost:4000/correntista/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(correntista),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      //console.log(`http://localhost:4000/correntista/${params.id}`);
      await fetch("http://localhost:4000/correntista", {
        method: "POST",
        body: JSON.stringify(correntista),
        headers: {"Content-Type":"application/json"}
      });
    }

    setCargando(false);
    navigate(`/correntista`);
  };
  
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.id){
      mostrarCorrentista(params.id);
    }
    axios
    .get('http://localhost:4000/usuario/vendedores')
    .then((response) => {
        console.log(response.data);
        //this.setState({vendedor_select: response.data})
        setVendedorSelect(response.data);
    })
    .catch((error) => {
        console.log(error);
    });
  },[params.id]);

  //Rico evento change
  const handleChange = e => {
    setCorrentista({...correntista, [e.target.name]: devuelveValor(e)});
    //console.log(e.target.name, e.target.value);
  }
  
  const devuelveValor = e =>{
      let strNombre;
      strNombre = e.target.name;
      strNombre = strNombre.substring(0,3);
      console.log(e.target.name);  
      if (strNombre === "chk"){
        console.log(e.target.checked);  
        return(e.target.checked);
      }else{
        console.log(e.target.value);
        return(e.target.value);
      }
  }

  //funcion para mostrar data de formulario, modo edicion
  const mostrarCorrentista = async (id) => {
    console.log(`http://localhost:4000/correntista/${id}`);
    const res = await fetch(`http://localhost:4000/correntista/${id}`);
    const data = await res.json();
    //Actualiza datos para enlace con controles, al momento de modo editar
    setCorrentista({
                    id_documento:data.id_documento, 
                    razon_social:data.razon_social, 
                    contacto:data.contacto, 
                    telefono:data.telefono,
                    email:data.email,
                    id_vendedor:data.id_vendedor,
                    relacionado:data.relacionado,
                    base:data.base
                  });
    console.log(data);
    console.log(data.relacionado);
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
                    {editando ? "EDITAR CORRENTISTA" : "CREAR CORRENTISTA"}
                </Typography>
                <CardContent>
                    <form onSubmit={handleSubmit} >
                        <TextField variant="filled" 
                                   label="Razon Social"
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="razon_social"
                                   value={correntista.razon_social}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                        />
                        <TextField variant="filled" 
                                   label="contacto"
                                   multiline
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="contacto"
                                   value={correntista.contacto}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />
                        <TextField variant="filled" 
                                   label="telefono"
                                   multiline
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="telefono"
                                   value={correntista.telefono}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />
                        <TextField variant="filled" 
                                   label="email"
                                   multiline
                                   sx={{display:'block',
                                        margin:'.5rem 0'}}
                                   name="email"
                                   value={correntista.email}
                                   onChange={handleChange}
                                   inputProps={{ style:{color:'white'} }}
                                   InputLabelProps={{ style:{color:'white'} }}
                         />

                        <FormControlLabel
                          control={<Checkbox 
                                    name="chkrelacionado" 
                                    checked={correntista.relacionado}
                                    onChange={handleChange} 
                                   />}
                          label="Correntista Relacionado"
                        />                        
                        <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                  <InputLabel id="demo-simple-select-label" 
                                              inputProps={{ style:{color:'white'} }}
                                              InputLabelProps={{ style:{color:'white'} }}
                                  >Vendedor</InputLabel>
                                  <Select
                                    labelId="vendedor_select"
                                    id={correntista.id_vendedor}
                                    value={correntista.id_vendedor}
                                    name="id_vendedor"
                                    sx={{display:'block',
                                    margin:'.5rem 0'}}
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

                        <Button variant='contained' 
                                color='primary' 
                                type='submit'
                                disabled={!correntista.razon_social || 
                                          !correntista.telefono}
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
