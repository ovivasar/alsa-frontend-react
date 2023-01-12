import { useEffect, useState } from "react"
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import IconButton from '@mui/material/IconButton';


export default function ZonaDetList() {
  
  const [zonasdet,setZonasDet] = useState([]);
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const cargaZonaDet = async () => {
    var strRuta="";
    if ((params.id)===undefined) {
      strRuta = `http://localhost:4000/zonadet`;
    }
    else {
      strRuta = `http://localhost:4000/zonadet/${params.id}`;
    }
    const response = await fetch(strRuta);
    const data = await response.json();
    setZonasDet(data);
    
  }

  const eliminarZonaDet = async (id_zonadet) => {
    await fetch(`http://localhost:4000/zonadet/${id_zonadet}`, {
      method:"DELETE"
    });
    
    setZonasDet(zonasdet.filter(zonasdet => zonasdet.id_zonadet !== id_zonadet));
    //console.log(data);
  }
  useEffect( ()=> {
    cargaZonaDet()
  },[])

  return (
  <>
    <div>Zonas de Entrega</div>
    {zonasdet.map((elemento) => (
        <Card style={{
          marginBottom:".5rem",
          backgroundColor:'#1e272e',
          height:'3rem',
          marginTop:".5rem",
          }}
          //aqui debemos tener en cuenta una clave, concatenada(vista mezclada cab-det), para eliminar visualmente en frond-end
          key={elemento.id_zonadet}
        >
          <CardContent style = {{
            display:"flex",
            justifyContent:"normal"
            }}>


            <div>
              <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                          onClick = {()=> navigate(`/zona/${elemento.id_zonadet}/edit`)}
              >
                <UpdateIcon />
              </IconButton>

              <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                          onClick = { () => eliminarZonaDet(elemento.id_zonadet)}
              >
                <DeleteIcon />
              </IconButton>

            </div>

            <div style={{color:'white'}}  hidden='true'>
              <Typography>{elemento.id_zonadet}</Typography>
            </div>
            <div style={{color:'white'}}>
            <Typography marginTop="0.5rem" >{elemento.nombre.padEnd(50-(elemento.nombre.length)," ")}</Typography>
            </div>
            <div style={{color:'white'}}>
            <Typography>{elemento.nombre_zona}</Typography>
            </div>

            
          </CardContent>
        </Card>
      ))}
  </>
  );
}
