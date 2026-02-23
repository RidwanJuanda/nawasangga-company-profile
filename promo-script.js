// Promo Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const estimationForm = document.getElementById('estimationForm');
    
    if (estimationForm) {
        estimationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const fullName = document.getElementById('fullName').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const meters = document.getElementById('meters').value;
            const category = document.getElementById('category').value;
            
            // Calculate estimate (example: Rp 20.000 per meter)
            const pricePerMeter = 20000;
            let totalPrice = pricePerMeter * meters;
            
            // Apply discount for orders above 10 meters
            let discount = 0;
            if (meters >= 50) {
                discount = 0.15; // 15% discount for 50+ meters
            } else if (meters >= 20) {
                discount = 0.10; // 10% discount for 20+ meters
            } else if (meters >= 10) {
                discount = 0.05; // 5% discount for 10+ meters
            }
            
            const discountAmount = totalPrice * discount;
            const finalPrice = totalPrice - discountAmount;
            
            // Format message
            let message = `Halo, saya ingin konsultasi dan estimasi biaya cetak DTF.\n\n`;
            message += `*Data Pemesanan:*\n`;
            message += `Nama: ${fullName}\n`;
            message += `WhatsApp: ${whatsapp}\n`;
            message += `Jumlah Meter: ${meters} meter\n`;
            message += `Kategori: ${category}\n\n`;
            message += `*Estimasi Biaya:*\n`;
            message += `Harga per meter: Rp ${pricePerMeter.toLocaleString('id-ID')}\n`;
            message += `Subtotal: Rp ${totalPrice.toLocaleString('id-ID')}\n`;
            if (discount > 0) {
                message += `Diskon ${(discount * 100).toFixed(0)}%: -Rp ${discountAmount.toLocaleString('id-ID')}\n`;
            }
            message += `*Total: Rp ${finalPrice.toLocaleString('id-ID')}*\n\n`;
            message += `Mohon konfirmasi dan konsultasi lebih lanjut. Terima kasih!`;
            
            // Encode message for WhatsApp
            const encodedMessage = encodeURIComponent(message);
            // Nomor WhatsApp: +6282261460088 atau yang beni +6282112519438
            const whatsappUrl = `https://wa.me/6282261460088?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }
});

