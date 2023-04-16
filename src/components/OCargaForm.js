import {Grid,Card,CardContent,Typography,TextField,Button,CircularProgress,Select, MenuItem, InputLabel, Box, FormControl, Switch, FormControlLabel, Checkbox} from '@mui/material'
import {useState,useEffect,useCallback,useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import AddBoxRoundedIcon from '@mui/icons-material/AddToQueue';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import DnsTwoToneIcon from '@mui/icons-material/DnsTwoTone';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

import swal from 'sweetalert';
import logo from '../alsa.png';
import miImagenCamion from '../camion3.png';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import LineWeightIcon from '@mui/icons-material/LineWeight';
import InputAdornment from '@mui/material/InputAdornment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

export default function OCargaForm() {
  //const back_host = process.env.BACK_HOST || "http://localhost:4000";
  const back_host = process.env.BACK_HOST || "https://alsa-backend-js-production.up.railway.app";  
  ////////////////////////////////////////////////////////////////////////////////////////
  const createPdf = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add logo to the top of the page
    //const logoImage = pdfDoc.embedPng(logo);
    const pngImage = await pdfDoc.embedPng(logo);
    const pngDims = pngImage.scale(0.5)

    page.drawImage(pngImage, {
      //x: page.getWidth() / 2 - pngDims.width / 2 + 75,
      //y: page.getHeight() / 2 - pngDims.height + 250,
      x: 210,
      y: 780,
      width: pngDims.width,
      height: pngDims.height,
    })

    const fontSize = 12;
    const lineHeight = fontSize * 1.2;
    const margin = 50;
    let x = margin;
    let y = height - margin - lineHeight - 10;
    
    y = y - 10;

    // Draw column headers
    page.drawText('ORDEN DE CARGA', { x:220, y, size: 16 });
    y=y-12; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    
    ////////////////////////////////////////////////////////////////////
    page.drawRectangle({
      x: margin,
      y: y,
      //width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
      width: 210+30,
      height: (lineHeight+7),
      borderWidth: 1,
      //color: rgb(0.778, 0.778, 0.778),
      borderColor: rgb(0.8,0.8,0.8)
    });
    page.drawText("FECHA DE ORDEN: ", { x:55, y:y+4, size: 10 });
    page.drawText(ocarga.fecha.toString(), { x:190, y:y+4, size: 12 });

    ////////////////////////////////////////////////////////////////////
    page.drawRectangle({
      x: margin+220+30,
      y: y,
      //width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
      width: 210+30,
      height: (lineHeight+7),
      borderWidth: 1,
      //color: rgb(0.778, 0.778, 0.778),
      borderColor: rgb(0.8,0.8,0.8)
    });
    page.drawText("NUMERO DE ORDEN: ", { x:55+220+30, y:y+4, size: 10 });
    page.drawText(ocarga.numero.toString(), { x:260+160+30, y:y+4, size: 12 });
    
    ////////////////////////////////////////////////////////////////////
    y=y-5; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    //page.drawText("CLIENTE", { x:260, y, size: 8 });
    //y=y-15; //aumentamos linea nueva
    //Calculamos el punto x, acorde al largo de la razon social (centradito chochera ... claro pi cojuda)
    //console.log(ocarga.ref_razon_social);
    let centro = (page.getWidth()/2) - (ocarga.ref_razon_social.toString().length)/2 - margin - 40;
    page.drawText("CLIENTE: " + ocarga.ref_razon_social, { x:centro, y, size: 10 });
    y=y-12; //aumentamos linea nueva
    y=y-12; //aumentamos linea nueva
    y=y-5; //aumentamos linea nueva
    
    ////////////////////////////////////////////////////////////////////
    // Draw table data
    let row = 1;
    let espaciadoDet = 0; //iniciamos en la 1era fila
    registrosdet.forEach((person) => {
      const text = `${person.operacion}`;
      const textX = x;
      //const textY = y - lineHeight * row;
      const textY = y - lineHeight; //corregimos aca, porque se duplicaba espacio en cada grupo
      page.drawRectangle({
        x: margin,
        y: y-espaciadoDet+2,
        width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
        height: (lineHeight+2),
        borderWidth: 1,
        color: rgb(0.778, 0.778, 0.778),
        borderColor: rgb(0.8,0.8,0.8)
      });
      //Calculamos el punto x, acorde al largo de la razon social (centradito chochera ... claro pi cojuda)
      centro = (page.getWidth()/2) - (person.operacion.toString().length)/2 - margin/1.2;
      page.drawText(text, { x:centro, y:y+4-espaciadoDet, size: 12, font }); //Texto de Titulo de Barra (Operacion)

      //1ERA LINEA
      //page.drawText("PRODUCTO", { x, y:textY-espaciadoDet, size: 8 });
      //Desglosar 2da Linea, DECREMENTAR LA POS Y UNA LINEA MAS ABAJO //NEW
      //espaciadoDet = espaciadoDet+10; ///NEW
      page.drawText(person.descripcion ?? "", { x, y: textY-espaciadoDet, size: 10, font });

      espaciadoDet = espaciadoDet+15; //NEW
      page.drawText("PEDIDO", { x, y:textY-espaciadoDet, size: 8 });//NEW
      page.drawText("CANTIDAD", { x:x+100, y:textY-espaciadoDet, size: 8 });
      page.drawText("UNIDAD", { x:x+200, y:textY-espaciadoDet, size: 8 });
      page.drawText("PLACA VACIO", { x:x+300, y:textY-espaciadoDet, size: 8 });
      page.drawText("PLACA CARGADO", { x:x+400, y:textY-espaciadoDet, size: 8 });
      
      espaciadoDet = espaciadoDet+15;

      page.drawText(person.pedido.toString(), { x, y: textY-espaciadoDet, size: 10, font });
      page.drawText(person.cantidad.toString(), { x:x+100, y: textY-espaciadoDet, size: 10, font });
      page.drawText(person.unidad_medida?.toString() ?? "", { x:x+200, y: textY-espaciadoDet, size: 10, font }); //Actualizar urgente
      if (person.tr_placa===null) {
        page.drawText("-", { x:x+300, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.tr_placa, { x:x+300, y: textY-espaciadoDet, size: 10, font });
      }
      if (person.tr_placacargado===null) {
        page.drawText("-", { x:x+400, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.tr_placacargado, { x:x+400, y: textY-espaciadoDet, size: 10, font });
      }

      //2DA LINEA
      espaciadoDet = espaciadoDet+15;
      page.drawText("LOTE CARGA", { x, y:textY-espaciadoDet, size: 8 });
      page.drawText("LOTE DESCARGA", { x:x+100, y:textY-espaciadoDet, size: 8 });
      page.drawText("HORA INI", { x:x+200, y:textY-espaciadoDet, size: 8 });
      page.drawText("HORA FIN", { x:x+300, y:textY-espaciadoDet, size: 8 });
      page.drawText("ESTIBADORES", { x:x+400, y:textY-espaciadoDet, size: 8 });

      espaciadoDet = espaciadoDet+15;
      if (person.lote_procedencia===null) {
        page.drawText("-", { x, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.lote_procedencia, { x, y: textY-espaciadoDet, size: 10, font, color:rgb(0,0.7,0) });
      }
      if (person.lote_asignado===null) {
        page.drawText("-", { x:x+100, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.lote_asignado, { x:x+100, y: textY-espaciadoDet, size: 10, font, color:rgb(0,0.2,0.8) });
      }
      if (person.e_hora_ini===null) {
        page.drawText("-", { x:x+200, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.e_hora_ini.toString(), { x:x+200, y: textY-espaciadoDet, size: 10, font });
      }
      if (person.e_hora_fin===null) {
        page.drawText("-", { x:x+300, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.e_hora_fin.toString(), { x:x+300, y: textY-espaciadoDet, size: 10, font });
      }
      if (person.e_estibadores===null) {
        page.drawText("-", { x:x+400, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.e_estibadores, { x:x+400, y: textY-espaciadoDet, size: 10, font });
      }
      
      //3ERA LINEA
      espaciadoDet = espaciadoDet+15;
      page.drawText("OBSERVACIONES", { x, y:textY-espaciadoDet, size: 8 });

      espaciadoDet = espaciadoDet+15;
      if (person.e_observacion===null) {
        page.drawText("-", { x, y: textY-espaciadoDet, size: 10, font });
      }else{
        page.drawText(person.e_observacion, { x, y: textY-espaciadoDet, size: 10, font });
      }

      //al final del bucle, aumentamos una linea simple :) claro pi ...
      espaciadoDet = espaciadoDet+50;

      /*page.drawText(person.cantidad.toString(), { x: x + 150, y: textY, size: fontSize, font });
      page.drawText(person.tr_placacargado, { x: x + 250, y: textY, size: fontSize, font });
      page.drawText(person.estado, { x: x + 350, y: textY, size: fontSize, font });
      page.drawText(person.zona_entrega, { x: x + 450, y: textY, size: fontSize, font });
      if (person.tr_placa===null) {
        page.drawText("PLACA VACIA", { x: x + 550, y: textY, size: fontSize, font });
      }else{
        page.drawText(person.tr_placa, { x: x + 550, y: textY, size: fontSize, font });
      }*/

      row++;
    });
    //Final
    page.drawRectangle({
      x: margin,
      y: y-espaciadoDet-30,
      width: (page.getWidth()-margin-50), //TODA ANCHO DE LA HOJA
      height: (lineHeight+40),
      borderWidth: 1,
      //color: rgb(0.778, 0.778, 0.778),
      borderColor: rgb(0.8,0.8,0.8)
    });
    page.drawText("ENCARGADO ALMACEN", { x:100, y:y-espaciadoDet-20, size: 8, font });
    page.drawText("ENCARGADO DESPACHO", { x:350, y:y-espaciadoDet-20, size: 8, font });

    // Creamos un enlace para descargar el archivo
    /*const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });
    const link = document.createElement('a');
    link.href = pdfBytes;
    link.download = 'ordencompra.pdf';
    link.target = '_blank'; // Abrir el PDF en una nueva pestaña
    document.body.appendChild(link);
    link.click();*/

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    // Crea una URL de objeto para el archivo Blob
    const url = URL.createObjectURL(blob);
    // Abre la URL en una nueva pestaña del navegador
    window.open(url, '_blank');

    // Hacemos clic en el enlace para descargar el archivo
    //link.click();
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////

  const [registrosdet,setRegistrosdet] = useState([]);
  //const fecha_actual = new Date();

  const [ocarga,setOCarga] = useState({
      id_empresa:'1',  
      id_punto_venta:'1001',  
      fecha:'',
      numero:'',
      ref_razon_social:'',//new
      estado:'', //esto viene del detalle, a evaluar
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
      console.log("Editando Ticket: ",ocarga);
      await fetch(`${back_host}/ocargaticket/${params.ano}/${params.numero}`, {
        method: "PUT",
        body: JSON.stringify(ocarga),
        headers: {"Content-Type":"application/json"}
      });
    }else{
      console.log("GRabando nuevo: ",ocarga);
      const res = await fetch(`${back_host}/ocarga`, {
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
    const res = await fetch(`${back_host}/ocarga/${ano}/${numero}`);
    const data = await res.json();
    setOCarga({  
                fecha:data.fecha,
                numero:data.numero,
                ticket:data.ticket,
                ref_razon_social:data.ref_razon_social,
                peso_ticket:data.peso_ticket,
                sacos_ticket:data.sacos_ticket
              });
    setEditando(true);

  };
  
  const mostrarOCargaDetalle = async (ano,numero) => {
    const res = await fetch(`${back_host}/ocargadet/${ano}/${numero}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
    //console.log(registrosdet.length);
    setEditando(true);
  };

  const eliminarVentaDetalleItem = async (ano,numero,item) => {
    await fetch(`${back_host}/ocargadet/${ano}/${numero}/${item}`, {
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
                                        sx={{display:'block',margin:'.5rem 0'}}
                                        //sx={{mt:-3}}
                                        name="numero"
                                        value={ocarga.numero}
                                        onChange={handleChange}
                                        inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                        InputLabelProps={{ style:{color:'white'} }}
                                />
                          </Grid>

                          <Grid item xs={1.6}>
                              <Button variant='outlined' 
                                            color='primary' 
                                            size='small'
                                            startIcon={<AssessmentRoundedIcon />}
                                            onClick={createPdf}
                                            fullWidth
                                            //sx={{display:'block',margin:'.5rem 0'}}
                                            sx={{margin:'.5rem 0', height:55}}
                                            >
                                REPORTE OC
                              </Button>
                          </Grid>

                          <Grid item xs={2}>
                            <TextField variant="outlined" 
                                    label="TICKET"
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <BookmarkBorderIcon />
                                        </InputAdornment>
                                      ),
                                    }}                                          
                                    sx={{display:'block',margin:'.5rem 0'}}
                                    name="ticket"
                                    value={ocarga.ticket}
                                    onChange={handleChange}
                                    inputProps={{ style:{color:'white',textAlign: 'center'} }}
                                    InputLabelProps={{ style:{color:'white'} }}
                            />
                          </Grid>

                          <Grid item xs={1.5}>
                                  <TextField variant="outlined" 
                                          label="TN."
                                          InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <LineWeightIcon />
                                              </InputAdornment>
                                            ),
                                          }}                                          
                                          sx={{display:'block',margin:'.5rem 0'}}
                                          name="peso_ticket"
                                          value={ocarga.peso_ticket}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                  />
                          </Grid>

                          <Grid item xs={1.5}>
                                  <TextField variant="outlined" 
                                          label="SACOS"
                                          //type="number"
                                          step="1"
                                          InputProps={{
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                <ViewCompactIcon />
                                              </InputAdornment>
                                            ),
                                          }}                                          
                                          sx={{display:'block',margin:'.5rem 0'}}
                                          name="sacos_ticket"
                                          value={ocarga.sacos_ticket}
                                          onChange={handleChange}
                                          inputProps={{ style:{color:'white', textAlign: 'center'} }}
                                          InputLabelProps={{ style:{color:'white'} }}
                                  />
                          </Grid>

                          <Grid item xs={0.8}>
                              <Button variant='contained' 
                                      color='primary' 
                                      type='submit'
                                      style={{backgroundImage: `url(${miImagenCamion})`, 
                                              backgroundSize: 'contain',
                                              backgroundSize: '100%', // Puedes ajustar el tamaño de la imagen aquí
                                              backgroundPosition: 'center top',
                                              backgroundRepeat: 'no-repeat',
                                              display: 'flex',
                                              flexDirection: 'row',
                                              justifyContent: 'flex-start',   
                                              //opacity: 0.3, // Puedes ajustar la transparencia del texto aquí                                           
                                              color: 'rgba(255, 255, 255, 0.3)', // Puedes ajustar la transparencia del texto aquícolor: 'rgba(255, 255, 255, 0.8)' // Puedes ajustar la transparencia del texto aquí
                                              width: '100px', // Puedes ajustar el ancho del botón aquí
                                              height: '55px' // Puedes ajustar la altura del botón aquí                                              
                                        }}
                                      sx={{margin:'.5rem 0', height:55}}
                                      disabled={
                                                !ocarga.ticket || 
                                                !ocarga.peso_ticket ||
                                                !ocarga.sacos_ticket
                                                }
                                      >
                                      { cargando ? (
                                      <CircularProgress color="inherit" size={24} />
                                      ) : (
                                        editando ?
                                      '' : 'Grabar')
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
                    OPERACION
                  </Grid>

                  <Grid item xs={1}>
                    CANT.
                  </Grid>

                  <Grid item xs={0.5}>
                    UND
                  </Grid>

                  <Grid item xs={1}>
                    PRODUCTO
                  </Grid>

                  <Grid item xs={2}>
                    CLIENTE
                  </Grid>

                  <Grid item xs={1}>
                    PLACA VACIO
                  </Grid>

                  <Grid item xs={1}>
                    PLACA CARGADO
                  </Grid>

                  <Grid item xs={1}>
                    ENTREGA
                  </Grid>
                  
                  <Grid item xs={1}>
                    PEDIDO
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
                      {indice.operacion}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.cantidad}
                      </Typography>
                  </Grid>

                  <Grid item xs={0.5}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.unidad_medida}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.descripcion}
                      </Typography>
                  </Grid>

                  <Grid item xs={2}>
                      <Typography fontSize={15} marginTop="0rem" >
                        {indice.ref_razon_social}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.tr_placa}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.tr_placacargado}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.zona_entrega}
                      </Typography>
                  </Grid>

                  <Grid item xs={1}>
                      <Typography fontSize={15} marginTop="0" >
                        {indice.pedido}
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
