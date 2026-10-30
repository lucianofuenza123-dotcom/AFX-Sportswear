
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Favorites from "./pages/Favorites";

import Layout from "./components/Layout";

import ScrollToTop from "./components/ScrollToTop";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
     <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;

