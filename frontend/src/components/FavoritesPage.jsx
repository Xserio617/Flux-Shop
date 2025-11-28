import React from 'react';
import { useFavorite } from '../context/FavoriteContext';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const { favorites } = useFavorite();

  return (
    <div style={{ 
        padding: '40px 10%', 
        minHeight: '80vh', 
        backgroundColor: 'var(--background-color)', // <-- ZEMİN RENGİ DEĞİŞTİ
        color: 'var(--text-color)' 
    }}>
      
      <h1 style={{ 
          color: 'var(--secondary-color)', 
          marginBottom: '20px', 
          borderBottom: '2px solid var(--border-color)', 
          paddingBottom: '10px' 
      }}>
        ❤️ Favorilerim ({favorites.length})
      </h1>

      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-light)' }}>
            <h3>Henüz favori ürünün yok.</h3>
            <p>Beğendiğin ürünlerin kalbine dokun, burada saklayalım.</p>
            <Link to="/">
                <button className="btn-primary" style={{marginTop: '20px'}}>Vitrine Dön</button>
            </Link>
        </div>
      ) : (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '20px' 
        }}>
            {favorites.map(fav => (
                // ProductCard zaten temaya uyumlu, sadece veriyi veriyoruz
                <ProductCard key={fav.id} product={fav.product_details} />
            ))}
        </div>
      )}
    </div>
  );
}