import { useEffect, useState } from "react"
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate,useParams } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/UpdateSharp';
import IconButton from '@mui/material/IconButton';

export default function ProductoList() {
  
  const [registro,setRegistrosDet] = useState([]);
  const navigate = useNavigate();
  //Para recibir parametros desde afuera
  const params = useParams();

  const cargaZonaDet = async () => {
    var strRuta="";
    strRuta = `http://localhost:4000/producto`;
    const response = await fetch(strRuta);
    const data = await response.json();
    setRegistrosDet(data);
  }

  const eliminarZonaDet = async (id_registro) => {
    await fetch(`http://localhost:4000/producto/${id_registro}`, {
      method:"DELETE"
    });
    
    setRegistrosDet(registro.filter(registro => registro.id_lote !== id_registro));
    //console.log(data);
  }
  useEffect( ()=> {
    cargaZonaDet()
  },[])

  return (
  <>
    <div>Productos</div>
    {registro.map((elemento) => (
        <Card style={{
          marginBottom:".5rem",
          backgroundColor:'#1e272e',
          height:'3rem',
          marginTop:".5rem",
          }}
          //aqui debemos tener en cuenta una clave, concatenada(vista mezclada cab-det), para eliminar visualmente en frond-end
          key={elemento.id_lote}
        >
          <CardContent style = {{
            display:"flex",
            justifyContent:"normal"
            }}>


            <div>
              <IconButton color="primary" aria-label="upload picture" component="label" size="small"
                          onClick = {()=> navigate(`/zona/${elemento.id_lote}/edit`)}
              >
                <UpdateIcon />
              </IconButton>

              <IconButton color="warning" aria-label="upload picture" component="label" size="small"
                          onClick = { () => eliminarZonaDet(elemento.id_lote)}
              >
                <DeleteIcon />
              </IconButton>

            </div>

            <div style={{color:'white'}}  hidden='true'>
              <Typography >{elemento.id_lote}</Typography>
            </div>
            <div style={{color:'white'}}>
            <Typography marginTop="0.5rem">{elemento.nombre}</Typography>
            </div>

            
          </CardContent>
        </Card>
      ))}
  </>
  );
}
