import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import MenuPage from "./pages/MenuPage/MenuPage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import SuccessPage from "./pages/SuccessPage/SuccessPage";
import ReservePage from "./pages/ReservePage/ReservePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import KitchenPage from "./pages/KitchenPage/KitchenPage";
import KitchenGate from "./pages/KitchenPage/KitchenGate";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/success" element={<SuccessPage />} />
          <Route path="/reserve" element={<ReservePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route
          path="/kitchen"
          element={
            <KitchenGate>
              <KitchenPage />
            </KitchenGate>
          }
        />
      </Routes>
    </CartProvider>
  );
}
