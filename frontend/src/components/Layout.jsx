import React from 'react';
import Navbar from './Navbar';
import TopBar from './TopBar';
import Footer from './Footer'; // <-- YENİ FOOTER

export default function Layout({ children }) { 
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      <TopBar />
      <Navbar />

      <div style={{ flex: 1 }}>
        {children} 
      </div>

      {/* YENİ FOOTER BURAYA GELDİ */}
      <Footer />
    </div>
  );
}