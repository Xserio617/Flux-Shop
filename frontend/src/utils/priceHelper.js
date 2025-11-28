// frontend/src/utils/priceHelper.js

export const calculateDiscount = (product) => {
    // Sayıları güvenli hale getir
    const originalPrice = parseFloat(product.price);
    const discountRate = parseInt(product.discount_rate) || 0;
    
    // Tarihleri kontrol et
    const now = new Date();
    const startDate = product.discount_start_date ? new Date(product.discount_start_date) : null;
    const endDate = product.discount_end_date ? new Date(product.discount_end_date) : null;

    let isValid = false;
    
    // İndirim oranı varsa ve tarihler uygunsa
    if (discountRate > 0) {
        if ((!startDate || now >= startDate) && (!endDate || now <= endDate)) {
            isValid = true;
        }
    }

    // Yeni fiyatı hesapla
    const finalPrice = isValid 
        ? originalPrice - (originalPrice * discountRate / 100)
        : originalPrice;

    return {
        originalPrice: originalPrice,
        finalPrice: finalPrice,
        hasDiscount: isValid,
        rate: discountRate
    };
};