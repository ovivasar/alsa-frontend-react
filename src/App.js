import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl, Switch, FormControlLabel, Checkbox} from '@mui/material'
import {BrowserRouter,Routes,Route} from "react-router-dom";
import {Container} from "@mui/material";
import Menu from "./components/NavBar";
import ZonaList from "./components/ZonaList";
import ZonaDetList from "./components/ZonaDetList";
import ZonaForm from "./components/ZonaForm";
import ZonaDetForm from "./components/ZonaDetForm";
import CorrentistaForm from "./components/CorrentistaForm";
import CorrentistaList from "./components/CorrentistaList";
import VentaForm from "./components/VentaForm";
import VentaList from "./components/VentaList";
import VentaFormDet from "./components/VentaFormDet";
import VentaFormDetTrans from "./components/VentaFormDetTrans"; //neww
import ProductoList from "./components/ProductoList";
import OCargaList from "./components/OCargaList";
import OCargaForm from "./components/OCargaForm";
import OCargaFormDet from "./components/OCargaFormDet";
import OCargaFormDetEstiba from "./components/OCargaFormDetEstiba";
import OCargaFormDet01 from "./components/OCargaFormDet01";
import OCargaFormDet02 from "./components/OCargaFormDet02";
import OCargaFormDet03 from "./components/OCargaFormDet03";

import Inicio from "./components/Inicio";
import { useState,useEffect, useRef, Component, useMemo, useCallback } from 'react';

function App() {
  const [fecha_proceso, setFechaProceso] = useState("");
  const handleChange = e => {
    //Para todos los demas casos ;)
    setFechaProceso(e.target.value);
  }
  useEffect( ()=> {
      //procesar fecha actual al inicio
      const fechaActual = new Date();
      let ano = fechaActual.getFullYear();
      let mes = fechaActual.getMonth()+1;
      let dia = fechaActual.getDate();      
      let strMes = mes.toString().padStart(2,'0');
      let strDia = dia.toString().padStart(2,'0');
      //let strFecha = strDia + "-" + strMes + "-" + ano; //no valido cuando empieza por dia
      let strFecha = ano + "-" + strMes + "-" + strDia; //OK valido empieza por año
      //console.log(strFecha)
      setFechaProceso(strFecha);
  },[]);

  return (
    <BrowserRouter>
      <Menu fecha_proceso={fecha_proceso}>

      </Menu>

      <Grid container spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
      >
            <TextField variant="outlined" 
                                            //label="fecha"
                                            sx={{display:'block',
                                                margin:'.5rem 0'}}
                                            name="fecha_proceso"
                                            size="small"
                                            type="date"
                                            value={fecha_proceso}
                                            onChange={handleChange}
                                            inputProps={{ style:{color:'white'} }}
                                            InputLabelProps={{ style:{color:'white'} }}
              />
      </Grid>

      <Container>
        <Routes>
          
          { /*
          <Route path="/ocargaplan/:fecha_proceso" element={<OCargaList />} />
          <Route path="/ocarga/new" element={<OCargaForm />} />
          <Route path="/ocarga/:ano/:numero/edit" element={<OCargaForm />} /> 
          */ }
          <Route path="/ocargadet/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet />} />
          <Route path="/ocargadet/:fecha_proceso/:ano/:numero/:item/:modo/clon" element={<OCargaFormDet />} />


          <Route path="/ocarga/:ano/:numero/edit" element={<OCargaForm />} />
          <Route path="/ocargadet/:fecha_proceso" element={<OCargaList />} />
          
          { /* Agregar desde Panel (un registro01 Libre)
               Agregar Clonado desde Panel (un registro01 con Numero Orden y datos adicionales)
               Agregar desde Form Orden (un registro01 con Numero Orden)   */ }
          <Route path="/ocargadet01/:fecha_proceso/new" element={<OCargaFormDet01 />} /> 
          <Route path="/ocargadet01/:fecha_proceso/:ano/:numero/:item/:modo/clon" element={<OCargaFormDet01 />} />
          <Route path="/ocargadet01/:fecha_proceso/:ano/:numero/:agrega/new" element={<OCargaFormDet01 />} />

          <Route path="/ocargadet01/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet01 />} />
          <Route path="/ocargadet02/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet02 />} />
          <Route path="/ocargadet03/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet03 />} />
          {/*  modo=edit, modo=clon  */}

          <Route path="/ventadet/:cod/:serie/:num/:elem/:fecha/new" element={<VentaFormDet />} />
          <Route path="/ventadet/:cod/:serie/:num/:elem/:item/edit" element={<VentaFormDet />} /> 
          <Route path="/ventadettrans/:cod/:serie/:num/:elem/:item/edit" element={<VentaFormDetTrans />} /> 
          <Route path="/venta/:fecha_proceso" element={<VentaList />} />          
          <Route path="/venta/new" element={<VentaForm />} />
          <Route path="/venta/:cod/:serie/:num/:elem/edit" element={<VentaForm />} /> 

          <Route path="/correntista" element={<CorrentistaList />} />          
          <Route path="/correntista/new" element={<CorrentistaForm />} />
          <Route path="/correntista/:id/edit" element={<CorrentistaForm />} /> 

          <Route path="/zonadet" element={<ZonaDetList />} />
          <Route path="/zonadet/:id" element={<ZonaDetList />} />
          <Route path="/zonadet/new" element={<ZonaDetForm />} />
          <Route path="/zonadet/:id/edit" element={<ZonaDetForm />} /> 

          <Route path="/" element={<Inicio />} />
          <Route path="/zona" element={<ZonaList />} />
          <Route path="/zona/new" element={<ZonaForm />} />
          <Route path="/zona/:id/edit" element={<ZonaForm />} />

          <Route path="/producto" element={<ProductoList />} />
          {/*Edit Route */}
        </Routes>
      </Container>
    </BrowserRouter>


    );
}

export default App;
