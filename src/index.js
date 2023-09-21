import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Auth0Provider } from '@auth0/auth0-react';


const domain = "dev-onc8ou0i85qkx5m2.us.auth0.com";

//Version Local
//const clientId = "3QVBxuBR5TU8gNI7kfPZwW4t9P3Occ4m";

//Version Web
//const clientId = "o7uLYv4yImQjxe5jC0djeMKvguaspdnt";

//Version Railway
const clientId = "P0z28wkCZJxzLMYbM9DZVf4zWT3K3C9n";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Auth0Provider
    domain={domain}
    clientId={clientId}
    //redirectUri="http://localhost:3000/carguio"
    //redirectUri="https://alsasrl.com.pe/carguio"
    redirectUri="https://alsa-frontend-react-production.up.railway.app/"

    //authorizationParams={{
    //  redirect_uri: window.location.origin // Utilizamos authorizationParams.redirect_uri en lugar de redirectUri
    //}}    
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();