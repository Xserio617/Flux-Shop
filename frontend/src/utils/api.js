// API Base URL - Otomatik olarak mevcut origin'i kullanır
const getApiBaseUrl = () => {
    // Tarayıcıda çalışıyorsa, mevcut origin'i kullan (ngrok veya localhost)
    if (typeof window !== 'undefined') {
        // Eğer localhost:5173 (Vite dev) ise, backend'e yönlendir
        if (window.location.port === '5173') {
            return 'http://127.0.0.1:8000';
        }
        // Diğer durumlarda (production veya ngrok), aynı origin'i kullan
        return window.location.origin;
    }
    
    // SSR veya Node ortamı için fallback
    return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;
