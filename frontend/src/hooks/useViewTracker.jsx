import { useEffect, useRef } from 'react';

// Basit bir UUID üretici (local kullanım için)
function genSessionId() {
  return 's_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-5);
}

export default function useViewTracker({ productId, intervalSeconds = 5 }) {
  const startedAt = useRef(null);
  const accSeconds = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!productId) return;

    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = genSessionId();
      localStorage.setItem('sessionId', sessionId);
    }

    startedAt.current = Date.now();
    accSeconds.current = 0;

    // Periodic gönderimler
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startedAt.current) / 1000);
      // Gönderilecek sadece son interval kadar
      const toSend = elapsed - accSeconds.current;
      if (toSend > 0) {
        accSeconds.current += toSend;
        // POST to backend
        fetch('/api/behavior/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, session_id: sessionId, time_seconds: toSend })
        }).catch(err => console.error('Behavior post error', err));
      }
    }, intervalSeconds * 1000);

    // On unmount send remaining
    return () => {
      clearInterval(timerRef.current);
      const now = Date.now();
      const elapsed = Math.floor((now - startedAt.current) / 1000);
      const remaining = elapsed - accSeconds.current;
      if (remaining > 0) {
        const sessionId2 = localStorage.getItem('sessionId');
        fetch('/api/behavior/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, session_id: sessionId2, time_seconds: remaining })
        }).catch(err => console.error('Behavior post error', err));
      }
    };
  }, [productId, intervalSeconds]);
}
