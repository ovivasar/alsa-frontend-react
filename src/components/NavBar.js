import {Box, Container, Toolbar} from "@mui/material";
import {useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';

import HomeIcon from '@mui/icons-material/Home';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GroupIcon from '@mui/icons-material/Group';
import PlaceIcon from '@mui/icons-material/Place';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { blueGrey } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';

//import { useState,useEffect, useRef, Component, useMemo, useCallback } from 'react';

export default function NavBar(props) {
  const navigate  = useNavigate();

  return (
    <Box sx={{ flexGrow:1 }} >
        <Container>
            <Toolbar>
                
                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/`);
                                                }
                                }
                    >
                      <HomeIcon />
                    </IconButton>

                    <Tooltip title="RESUMEN Ventas">
                    <IconButton  
                        sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                    navigate(`/venta/${props.fecha_ini}/${props.fecha_proceso}`);
                                                }
                                }
                    >
                      <FactCheckIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="RESUMEN Ordenes Carga">
                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                                component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/ocargadet/${props.fecha_ini}/${props.fecha_proceso}`);
                                                }
                                }
                    >oc
                      <FactCheckIcon />
                    </IconButton>
                    </Tooltip>

                    <Tooltip title="Clientes, RUC">
                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/correntista`);
                                                }
                                }
                    >
                      <GroupIcon />
                    </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Zonas de Venta">
                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        color="primary" aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/zona`);
                                                }
                                }
                    >
                      <PlaceIcon />
                    </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Zonas de Entrega">
                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/zonadet`);
                                                }
                                }
                    >
                      <WhereToVoteIcon />
                    </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Productos">
                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/producto`);
                                                }
                                }
                    >
                      <QrCodeIcon />
                    </IconButton>
                    </Tooltip>

            </Toolbar>
        </Container>
    </Box>
  );
}
