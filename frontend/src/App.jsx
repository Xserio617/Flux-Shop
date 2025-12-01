import 'animate.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Sayfalar ve Detay Bileşenleri
import ProductDetailPage from "./components/ProductDetailPage";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import OrderSuccess from "./components/OrderSuccess";
import AuthPage from "./components/AuthPage";
import FavoritesPage from "./components/FavoritesPage";
import ProfilePage from "./components/ProfilePage";
import AddressesPage from "./components/AddressesPage";
import SearchResultsPage from "./components/SearchResultsPage";
import CargoTrackingPage from "./components/CargoTrackingPage";
import FAQPage from "./components/FAQPage";
import PrivacyPage from "./components/PrivacyPage";
import AboutPage from "./components/AboutPage";
import ReturnsPage from "./components/ReturnsPage";
import CareersPage from "./components/CareersPage";
import ContactPage from "./components/ContactPage";
import OrdersPage from "./components/OrdersPage";

// Ana Sayfa Bileşenleri
import HeroSlider from "./components/HeroSlider";
import ProductCarousel from "./components/ProductCarousel";
import ProductGrid from "./components/ProductGrid";

// Düzen (Navbar ve Footer'ı tutan çatı)
import Layout from "./components/Layout";

// AI Chatbot
import AIChatBot from "./components/AIChatBot";

// Bildirimler
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Layout>
        {/* Bildirim Kutusu (Her sayfada görünür) */}
        <ToastContainer 
            position="top-right" 
            autoClose={3000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            theme="light" 
        />

        <Routes>
          
          {/* --- ANA SAYFA --- */}
          <Route path="/" element={
            <>
             {/* 1. Büyük Banner */}
             <HeroSlider /> 
             
             {/* 2. İndirimli Ürünler (Kayan Liste) */}
             <ProductCarousel />

             {/* 3. Tüm Ürünler (Filtreli Izgara) */}
             <ProductGrid />
            </>
          } />

          {/* --- KULLANICI --- */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/addresses" element={<AddressesPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* --- ALIŞVERİŞ --- */}
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          
          {/* --- ÖDEME SÜRECİ --- */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrdersPage />} />
          
          {/* --- YARDIM --- */}
          <Route path="/kargo-takip" element={<CargoTrackingPage />} />
          <Route path="/sss" element={<FAQPage />} />
          <Route path="/gizlilik" element={<PrivacyPage />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/iade" element={<ReturnsPage />} />
          <Route path="/kariyer" element={<CareersPage />} />
          <Route path="/iletisim" element={<ContactPage />} />

        </Routes>
        
        {/* AI Chatbot - Tüm sayfalarda görünür */}
        <AIChatBot />
    </Layout>
  )
}

export default App