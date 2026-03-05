
import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51T41VdQnuZRSHLNi3aVFEXoSpYw2QMoWSnIjMfyUhDvNv4s71VgHyivNWxNI5FmDBvIk1if8j9RfZzw7SlZAsjJc00Wocl8OIC");

createRoot(document.getElementById('root')).render(

   <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
 
);
