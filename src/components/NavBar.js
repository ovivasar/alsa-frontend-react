import {AppBar, Box, Button, Container, Toolbar, Typography} from "@mui/material";
import {Link,useNavigate} from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import AddBoxRoundedIcon from '@mui/icons-material/AddToQueue';

import HomeIcon from '@mui/icons-material/Home';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import GroupIcon from '@mui/icons-material/Group';
import PlaceIcon from '@mui/icons-material/Place';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { blueGrey } from '@mui/material/colors';

import { useState,useEffect, useRef, Component, useMemo, useCallback } from 'react';

export default function NavBar(props) {
  const navigate  = useNavigate();
  //const [fecha_proceso, setFechaProceso] = useState("");

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

                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/venta/${props.fecha_proceso}`);
                                                }
                                }
                    >
                      <FactCheckIcon />
                    </IconButton>

                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/ocargadet/${props.fecha_proceso}`);
                                                }
                                }
                    >
                      <FactCheckIcon />
                    </IconButton>

                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/correntista`);
                                                }
                                }
                    >
                      <GroupIcon />
                    </IconButton>

                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        color="primary" aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/zona`);
                                                }
                                }
                    >
                      <PlaceIcon />
                    </IconButton>

                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/zonadet`);
                                                }
                                }
                    >
                      <WhereToVoteIcon />
                    </IconButton>

                    <IconButton  sx={{ flexGrow:1,color: blueGrey[300] }}
                        aria-label="upload picture" component="label" size="large"
                                onClick = {()=> {
                                  navigate(`/producto`);
                                                }
                                }
                    >
                      <QrCodeIcon />
                    </IconButton>

            </Toolbar>
        </Container>
    </Box>
  );
}
