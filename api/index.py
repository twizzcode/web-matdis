from flask import Flask, request, jsonify
import pickle
import numpy as np
import os

app = Flask(__name__)

# --- KONFIGURASI ---
# Menggunakan path absolut agar aman di lingkungan Vercel
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'model_rekomendasi.pkl')

THRESHOLD_SANGAT_COCOK = 0.70 
THRESHOLD_CUKUP_COCOK = 0.30  

CROP_NAME_MAPPING = {
    "Kopi": "coffee", "Jeruk": "orange", "Melon": "muskmelon",
    "Padi": "rice", "Semangka": "watermelon", "Jagung": "maize",
    "Pepaya": "papaya", "Pisang": "banana"
}

# --- LOAD MODEL ---
model_rf = None
try:
    with open(MODEL_PATH, 'rb') as file:
        model_rf = pickle.load(file)
    print("Model berhasil dimuat.")
except Exception as e:
    print(f"Error memuat model: {e}")

@app.route('/api/validate_crop', methods=['POST'])
def validate_crop():
    # Cek apakah model siap
    if not model_rf:
        return jsonify({'error': 'Model server belum siap/gagal dimuat.'}), 500

    try:
        data = request.json
        target_crop_display = data.get('target_crop')
        target_crop_internal = CROP_NAME_MAPPING.get(target_crop_display)
        
        if not target_crop_internal:
            return jsonify({'error': 'Tanaman tidak valid.'}), 400

        # Ambil data fitur
        features = [
            float(data['n']), float(data['p']), float(data['k']),
            float(data['temperature']), float(data['humidity']),
            float(data['ph']), float(data['rainfall'])
        ]
        
        # Prediksi
        input_data = np.array([features])
        all_probabilities = model_rf.predict_proba(input_data)[0]
        prob_dict = dict(zip(model_rf.classes_, all_probabilities))
        
        crop_prob = prob_dict.get(target_crop_internal, 0.0)
        prob_percent = f"{crop_prob*100:.2f}%"

        # Tentukan Status
        if crop_prob >= THRESHOLD_SANGAT_COCOK:
            status = "Sangat Cocok"
            desc = f"Kondisi lahan sangat ideal untuk {target_crop_display}."
        elif crop_prob >= THRESHOLD_CUKUP_COCOK:
            status = "Cukup Cocok"
            desc = f"Lahan mendukung untuk {target_crop_display}, namun mungkin perlu perawatan."
        else:
            status = "Tidak Cocok"
            desc = f"Kondisi lahan kurang sesuai untuk {target_crop_display}. Risiko tinggi."

        return jsonify({
            "tanaman_target": target_crop_display,
            "status_kecocokan": status,
            "persentase_kecocokan": prob_percent,
            "deskripsi": desc
        })

    except Exception as e:
        return jsonify({'error': f'Server Error: {str(e)}'}), 500

# Tidak perlu app.run() karena Vercel menanganinya via WSGI