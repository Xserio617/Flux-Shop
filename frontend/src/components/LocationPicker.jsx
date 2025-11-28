import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Harita üzerine tıklama event'i
function LocationSelector({ onLocationSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      onLocationSelect({ lat, lng });
    },
  });

  return selectedLocation ? (
    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
      <Popup>
        Seçilen Konum: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
}

export default function LocationPicker({ isOpen, onClose, onLocationSelect }) {
  const [location, setLocation] = useState([39.9334, 32.8597]); // Ankara merkez

  if (!isOpen) return null;

  const handleLocationSelect = (latlng) => {
    setLocation([latlng.lat, latlng.lng]);
  };

  const handleConfirm = () => {
    // Seçilen konumu parent'a gönder
    const selectedLocation = {
      lat: location[0],
      lng: location[1],
    };
    
    // Reverse geocoding (koordinattan adres bulma)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedLocation.lat}&lon=${selectedLocation.lng}`
    )
      .then((res) => res.json())
      .then((data) => {
        onLocationSelect({
          address: data.address?.road || data.address?.hamlet || 'Seçilen Konum',
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          fullAddress: data.display_name,
        });
        onClose();
      })
      .catch((err) => {
        console.error('Geocoding hatası:', err);
        onLocationSelect(selectedLocation);
        onClose();
      });
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--surface-color)',
          width: '90%',
          maxWidth: '800px',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          maxHeight: '90vh',
          color: 'var(--text-color)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '15px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px' }}>Adresinizi Haritadan Seçin</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-light)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Harita */}
        <div style={{ height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <LocationSelector onLocationSelect={handleLocationSelect} />
          </MapContainer>
        </div>

        {/* Butonlar */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'flex-end',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--background-color)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-color)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            İptal
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--primary-color)',
              border: 'none',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Konumu Onayla
          </button>
        </div>
      </div>
    </div>
  );
}
