import React, { useState } from "react";
import { Spinner } from "reactstrap";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";
//import ExcelJS from "exceljs"; // Importa la biblioteca exceljs en lugar: Caso Doc Contable

const BotonExcelCrossTab = ({ registrosdet,meses,valorVista }) => {
    let  descripcionTitulo;
    const [loading, setLoading] = useState(false);
  if (valorVista==="pedidos"){
    descripcionTitulo = "RESUMEN DE OPERACIONES MENSUAL: # PEDIDOS";
  }else{
    if (valorVista==="cliente"){
        descripcionTitulo = "RESUMEN DE OPERACIONES MENSUAL: TN - CLIENTE";
    }else{
      if (valorVista==="producto"){
        descripcionTitulo = "RESUMEN DE OPERACIONES MENSUAL: TN - PRODUCTO";
      }
      else{
        if (valorVista==="vendedor"){
            descripcionTitulo = "RESUMEN DE OPERACIONES MENSUAL: TN - VENDEDOR";
        }
        else{
          //ZONA
          descripcionTitulo = "RESUMEN DE OPERACIONES MENSUAL: TN - ZONA";
        }
      }
    }
  }

  const titulo = [{ A: descripcionTitulo }, {}];

  const informacionAdicional = {
    A: "Doc Negocios Web  |||  ovivasar@gmail.com  whathsapp +51 954807980",
  };

  const longitudes = [50, 10, 12, 10, 15, 15, 12, 15];

  const handleDownload = () => {
    setLoading(true);
    
    /*
    //1er paso: define las columnas de la tabla, sin contenido
    let tabla = [
      {
        A: "Descripcion",
        B: "Total",
        //C: "2023-01",
        //D: "2023-02",        
        // sucesivamente conform a un arreglo llamado "meses" que contiene 2023-##
      },
    ];

    //2do paso: convierte a float algunas columnas numericas
    const newData = registrosdet.map((item) => ({
        ...item,
        total_cli: parseFloat(item.total_cli),
        //Aqui debemos convertir el valor de los meses dinamicamente, a float
        //"2023-01": parseFloat(item."2023-01"),
        //"2023-02": parseFloat(item."2023-02"),
        //"2023-03": parseFloat(item."2023-03"),
        //la variable contiene los meses = "meses"
      }));

    //3er paso: por cada elemento de la nueva data modificada
    newData.forEach((item) => {
      tabla.push({
        A: item.descripcion,
        B: item.total_cli,
        //C: item.pedido,
        //iterar el arreglo [meses]
      });
    });*/

    ////////////////////////////////////////////////////////////////////////
    //1er paso: define las columnas de la tabla, sin contenido
    let tabla = [
        {
          A: "Descripcion",
          B: "Total",
          ...meses.reduce((acc, mes, index) => {
            acc[String.fromCharCode(67 + index)] = mes;
            return acc;
          }, {}),
        },
      ];
      console.log("meses:", meses);
      console.log("tabla:", tabla);
    //2do paso: convierte a float algunas columnas numericas
    const newData = registrosdet.map((item) => {
        const convertedItem = { descripcion:(item.descripcion),total_cli: parseFloat(item.total_cli), ...item, };
      
        for (const mes of meses) {
          convertedItem[mes] = item[mes] !== null ? parseFloat(item[mes]) : 0;
        }
      
        return convertedItem;
    });
                
    // Ahora, podemos agregar los objetos de newData a la tabla
    newData.forEach((item) => {
      tabla.push({
        ...item, // Agregamos los valores de los meses dinámicamente
      });
    });
    /////////////////////////////////////////////////////////////////////

    const dataFinal = [...titulo, ...tabla, informacionAdicional];

    setTimeout(() => {
      creandoArchivoEstilizado(dataFinal);
      setLoading(false);
    }, 1000);
  };

  const creandoArchivoEstilizado = (dataFinal) => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = dataFinal.map((item) => Object.values(item));
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
    const estiloFila = {
      fill: { fgColor: { rgb: "0000FF" } }, // Color de fondo en formato RGB (Azul)
      font: { color: { rgb: "FFFFFF" } }, // Color de texto en formato RGB (Blanco)
    };
  
    // Aplicar el estilo a la primera fila
    const primeraFila = XLSX.utils.decode_range("A1:Z1");
    for (let col = primeraFila.s.c; col <= primeraFila.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = worksheet[cellAddress];
  
      if (cell) {
        cell.s = estiloFila;
      }
    }
  
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
  
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ProductosEstilizado.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  };
    
  
  return (
    <>
      {!loading ? (

        <Button variant='contained' 
        color='success' 
        fullWidth
        sx={{display:'block',
        margin:'.0rem 0'}}
        onClick={handleDownload}>        
        EXCEL
        </Button>
      ) : (
        <Button color="success" disabled>
          <Spinner size="sm">Loading...</Spinner>
          <span> Generando...</span>
        </Button>
      )}
    </>
  );
};

export default BotonExcelCrossTab;
