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
import ProductoList from "./components/ProductoList";
import OCargaList from "./components/OCargaList";
import OCargaForm from "./components/OCargaForm";
import OCargaFormDet from "./components/OCargaFormDet";
import OCargaFormDetEstiba from "./components/OCargaFormDetEstiba";

import Inicio from "./components/Inicio";

function App() {
  return (
    <BrowserRouter>
      <Menu>

      </Menu>
      <Container>
        <Routes>
          
          { /*
          <Route path="/ocargaplan/:fecha_proceso" element={<OCargaList />} />
          <Route path="/ocarga/new" element={<OCargaForm />} />
          <Route path="/ocarga/:ano/:numero/edit" element={<OCargaForm />} /> 
          */ }
          
          <Route path="/ocargadet/:fecha_proceso" element={<OCargaList />} />
          <Route path="/ocargadet/:fecha_proceso/new" element={<OCargaFormDet />} />
          <Route path="/ocargadet/:fecha_proceso/:ano/:numero/:item/:modo/edit" element={<OCargaFormDet />} />
          <Route path="/ocargadet/:fecha_proceso/:ano/:numero/:item/:modo/clon" element={<OCargaFormDet />} />
          {/*  modo=edit, modo=clon  */}

          <Route path="/ventadet/:cod/:serie/:num/:elem/:fecha/new" element={<VentaFormDet />} />
          <Route path="/ventadet/:cod/:serie/:num/:elem/:item/edit" element={<VentaFormDet />} /> 
          <Route path="/venta" element={<VentaList />} />          
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
