import { useEffect, useState } from "react"
import { Button, Card, CardContent, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";

export default function ZonaList() {
  
  const [zonas,setZonas] = useState([]);
  const navigate = useNavigate();

  const cargaZona = async () => {
    const response = await fetch('http://localhost:4000/zona');
    const data = await response.json();
    setZonas(data);
    //console.log(data);
  }

  const eliminarZona = async (id_zona) => {
    await fetch(`http://localhost:4000/zona/${id_zona}`, {
      method:"DELETE"
    });
    
    setZonas(zonas.filter(zonas => zonas.id_zona !== id_zona));
    //console.log(data);
  }
  
  useEffect( ()=> {
    cargaZona()
  }, [])

  return (
  <>
    <div>Zonas Venta </div>
    {
      zonas.map((zona) => (
        <Card style={{
          marginBottom:".5rem",
          backgroundColor:'#1e272e',
          height:'3rem',
          marginTop:".5rem",
          }}
          key={zona.id_zona}
        >
          <CardContent style = {{
            display:"flex",
            justifyContent:"normal"
            }}>
            
            <div>
              <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                          onClick = {()=> navigate(`/zona/${zona.id_zona}/edit`)}
              >
                <UpdateIcon />
              </IconButton>

              <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                          onClick = { () => eliminarZona(zona.id_zona)}
              >
                <DeleteIcon />
              </IconButton>

            </div>

              <div style={{color:'white'}} >
              <Typography fontSize={15} marginTop="0.5rem" >{zona.nombre}</Typography>
              </div>
              <div style={{color:'white'}}  hidden='true'>
              <Typography >{zona.id_zona}</Typography>
              </div>

          </CardContent>
        </Card>
      ))
    }

  </>
  );
}
