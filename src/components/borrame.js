import {useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';

export default function VentaForm() {
  ////////////////////////////////////////////////////////////////////////////////////////
  const [registrosdet,setRegistrosdet] = useState([]);
  const params = useParams();
  const body="";
  //Aqui se leen parametros en caso lleguen
  useEffect( ()=> {
    if (params.cod){
      mostrarVentaDetalle(params.cod,params.serie,params.num,params.elem);
      construirBody();
    }  
  },[params.cod]);

  const mostrarVentaDetalle = async (cod,serie,num,elem) => {
    const res = await fetch(`http://localhost:4000/ventadet/${cod}/${serie}/${num}/${elem}`);
    const dataDet = await res.json();
    setRegistrosdet(dataDet);
  };

  const construirBody = ()=>{
    if (Array.isArray(registrosdet) && registrosdet.length > 0) {
      body = (
        <div>
          {registrosdet.map((indice) => (
            indice ? <div>Funciona carajo</div> : null
          ))}
        </div>
      );
    }else{
      body = (
        <div>
        </div>
      );
    }
  }
///Body para Modal de Busqueda Incremental de Pedidos

  return (
  <div> 
      {
         body
      }
  </div>    
  );
}
