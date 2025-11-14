# Frontend - Sistem Validasi Lahan Cerdas

Frontend aplikasi web untuk prediksi kecocokan tanah menggunakan HTML, CSS, dan JavaScript.

## 🚀 Quick Start

### 1. Konfigurasi API Endpoint

Edit file `config.js`:

```javascript
// Untuk development lokal
const API_BASE_URL = 'http://localhost';

// Untuk production VPS
const API_BASE_URL = 'http://YOUR_VPS_IP';

// Untuk custom port
const API_BASE_URL = 'http://YOUR_VPS_IP:8000';
```

### 2. Deploy

**Opsi A: Deploy Lokal (testing)**
- Buka `index.html` langsung di browser
- Pastikan backend sudah berjalan di `http://localhost`

**Opsi B: Deploy dengan Web Server**

Menggunakan Python:
```bash
python -m http.server 3000
```

Menggunakan Node.js:
```bash
npx serve
```

**Opsi C: Deploy di VPS dengan Nginx**

1. Install Nginx:
```bash
apt install nginx -y
```

2. Copy files:
```bash
cp * /var/www/html/
```

3. Edit config.js dengan IP VPS Anda
4. Akses: `http://YOUR_VPS_IP`

**Opsi D: Deploy di Vercel/Netlify**

1. Upload folder `frontend` ke GitHub
2. Connect repository ke Vercel/Netlify
3. Deploy otomatis
4. Edit `config.js` dengan URL backend Anda

## 📁 Files

- `index.html` - Halaman utama aplikasi
- `config.js` - Konfigurasi API endpoint (EDIT INI!)

## 🎨 Features

- ✅ Form input parameter lahan (N, P, K, suhu, kelembapan, pH, hujan)
- ✅ Dropdown pilihan 8 jenis tanaman
- ✅ Hasil prediksi Random Forest dengan persentase
- ✅ Analisis AI dari Google Gemini
- ✅ Rekomendasi langkah perbaikan lahan
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time validation & error handling

## 🔧 Kustomisasi

### Mengubah Warna Tema

Edit CSS di `index.html`:
```css
:root {
    --primary-color: #005A9C;   /* Warna utama */
    --secondary-color: #00A3E0; /* Warna aksen */
}
```

### Menambah Tanaman Baru

Edit dropdown di `index.html`:
```html
<option value="NamaTanaman">🌱 Nama Tanaman</option>
```

**Note:** Backend juga harus mendukung tanaman tersebut!

## 🌐 CORS (Cross-Origin)

Jika frontend dan backend di domain berbeda:

1. Backend sudah menggunakan `flask-cors`
2. Jika masih error, tambahkan header di backend:
```python
CORS(app, resources={r"/*": {"origins": "*"}})
```

## 📱 Browser Support

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🐛 Troubleshooting

**Error: "Failed to fetch"**
- Cek `config.js` URL sudah benar
- Pastikan backend running: `curl http://YOUR_BACKEND_URL/health`
- Cek CORS configuration

**Error: "Network error"**
- Periksa firewall VPS
- Pastikan port backend terbuka
- Test dengan: `curl http://YOUR_VPS_IP/health`

**Tampilan berantakan**
- Clear browser cache (Ctrl+Shift+Del)
- Hard reload (Ctrl+F5)

## 🔒 Production Checklist

- [ ] Update `config.js` dengan URL production
- [ ] Test semua form validation
- [ ] Test di berbagai browser
- [ ] Compress images (jika ada)
- [ ] Minify CSS/JS (optional)
- [ ] Setup HTTPS (jika menggunakan domain)

## 📞 Support

Jika ada masalah:
1. Buka browser console (F12) untuk error details
2. Test backend: `curl http://YOUR_BACKEND_URL/health`
3. Cek network tab di browser developer tools
