import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import StarInput from './StarInput'; // <-- YENİ EKLENEN
import StarRating from './StarRating'; // <-- Mevcut Yıldız Görüntüleyici
import styles from './ReviewsSection.module.css'; // <-- YENİ EKLENEN CSS

export default function ReviewsSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5); // Başlangıçta 5 yıldız
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const { isLoggedIn } = useAuth(); 

  const fetchReviews = () => {
    axios.get(`/api/products/${productId}/reviews/`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Yorumlar çekilemedi:", err));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Önizlemeleri oluştur
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn || rating === 0) {
        toast.error("Yorum göndermek için puan ve giriş şart! ❌");
        return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      
      // Önce Review'ı oluştur
      const reviewResponse = await axios.post(`/api/products/${productId}/reviews/`, 
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const reviewId = reviewResponse.data.id;
      
      // Resimleri yükle (eğer varsa)
      if (selectedImages.length > 0) {
        for (const image of selectedImages) {
          const formData = new FormData();
          formData.append('image', image);
          
          await axios.post(`/api/reviews/${reviewId}/images/`, formData, {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      }
      
      toast.success("Yorumun başarıyla eklendi! 🚀", { theme: "colored" });
      setComment('');
      setRating(5);
      setSelectedImages([]);
      setImagePreviews([]);
      fetchReviews();
    } catch (error) {
      toast.error("Yorum gönderilemedi. Lütfen tekrar dene. ❌");
    }
  };

  return (
    <div className={styles.reviewsSection}>
      <h3 className={styles.heading}>
        📝 Ürün Yorumları ({reviews.length})
      </h3>

      {/* --- YORUM LİSTESİ --- */}
      <div style={{ marginBottom: '30px' }}>
        {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
        ) : (
            reviews.map(review => (
                <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.userMeta}>
                        <strong className={styles.userName}>
                            {review.user_username || "Kullanıcı"}
                        </strong> 
                        {/* Mevcut Yıldız Görüntüleyici */}
                        <StarRating rating={review.rating} size={18} />
                    </div>
                    <p style={{ color: 'var(--text-color)', margin: '5px 0' }}>{review.comment}</p>
                    
                    {/* RESİMLER */}
                    {review.images && review.images.length > 0 && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        marginTop: '10px', 
                        flexWrap: 'wrap'
                      }}>
                        {review.images.map(img => (
                          <img
                            key={img.id}
                            src={img.image}
                            alt="Yorum resmi"
                            style={{
                              width: '100px',
                              height: '100px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              border: '1px solid var(--border-color)',
                              cursor: 'pointer'
                            }}
                            onClick={() => window.open(img.image, '_blank')}
                          />
                        ))}
                      </div>
                    )}
                    
                    <small style={{ color: 'var(--text-light)', fontSize: '12px' }}>
                        {new Date(review.created_at).toLocaleDateString()}
                    </small>
                </div>
            ))
        )}
      </div>

      {/* --- YORUM EKLEME FORMU --- */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
            <h4 style={{ color: 'var(--text-color)', marginBottom: '15px' }}>Puan Ver</h4>
            
            {/* YILDIZ INPUT BİLEŞENİ BURAYA GELDİ */}
            <div style={{ marginBottom: '15px' }}>
                <StarInput rating={rating} setRating={setRating} />
            </div>

            <textarea 
                rows="3" 
                placeholder="Ürün hakkında ne düşünüyorsun?" 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                className={styles.formInput}
                style={{ marginBottom: '15px' }}
            ></textarea>

            {/* RESİM YÜKLEME */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-color)' }}>
                📸 Resim Ekle (İsteğe bağlı)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  cursor: 'pointer'
                }}
              />
              <small style={{ color: 'var(--text-light)', marginTop: '5px', display: 'block' }}>
                Maksimum 5 resim yükleyebilirsiniz
              </small>
            </div>

            {/* ÖNİZLEMELER */}
            {imagePreviews.length > 0 && (
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '15px',
                flexWrap: 'wrap'
              }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt={`Ön izleme ${index + 1}`}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid var(--primary-color)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn-primary">YORUMU GÖNDER</button>
        </form>
      ) : (
        <div style={{ padding: '20px', backgroundColor: 'var(--background-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-light)' }}>
            Yorum yapabilmek için <a href="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold', textDecoration: 'underline' }}>Giriş Yapmalısın</a>.
        </div>
      )}

    </div>
  );
}