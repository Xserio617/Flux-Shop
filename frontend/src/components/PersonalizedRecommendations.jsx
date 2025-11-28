import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function PersonalizedRecommendations({ productId, limit = 8 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = '/api/recommendations/';
    if (productId) url += `?product_id=${productId}&limit=${limit}`;

    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'success') {
          setItems(data.products || []);
        }
      })
      .catch(err => console.error('Recommendations error', err))
      .finally(() => setLoading(false));
  }, [productId, limit]);

  if (loading) return null;
  if (!items || items.length === 0) return null;

  return (
    <div style={{ marginTop: '30px', padding: '0 10%' }}>
      <h3 style={{ textAlign: 'center', color: 'var(--text-color)', marginBottom: '10px' }}>Size Özel</h3>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '10px 0' }}>
        {items.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} style={{ minWidth: '180px', textDecoration: 'none' }}>
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <img src={p.image || '/favicon.svg'} alt={p.name} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
              <div style={{ marginTop: '8px', color: 'var(--text-color)', fontWeight: '600' }}>{p.name}</div>
              <div style={{ color: 'var(--primary-color)', fontWeight: '700', marginTop: '6px' }}>{p.price} TL</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
