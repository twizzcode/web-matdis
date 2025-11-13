"use client";
import { useState } from 'react';

interface ResultData {
  status_kecocokan: string;
  persentase_kecocokan: string;
  tanaman_target: string;
  deskripsi: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/validate_crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || 'Gagal menghubungi server');
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">🌱 Validasi Lahan</h1>
          <p className="text-gray-600">Cek kecocokan tanaman menggunakan Machine Learning</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* FORM SECTION */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">PILIH TANAMAN</label>
                <select name="target_crop" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition" required>
                  <option value="" disabled selected>-- Pilih Tanaman --</option>
                  <option value="Kopi">☕ Kopi</option>
                  <option value="Jeruk">🍊 Jeruk</option>
                  <option value="Melon">🍈 Melon</option>
                  <option value="Padi">🌾 Padi</option>
                  <option value="Semangka">🍉 Semangka</option>
                  <option value="Jagung">🌽 Jagung</option>
                  <option value="Pepaya">🥭 Pepaya</option>
                  <option value="Pisang">🍌 Pisang</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall'].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">{field}</label>
                    <input type="number" step="any" name={field} placeholder="0" required 
                      className="w-full p-2 border border-gray-300 rounded bg-white focus:border-blue-500 outline-none" />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? '⏳ Sedang Menganalisis...' : '🚀 Analisis Sekarang'}
              </button>
            </form>
          </div>

          {/* RESULT SECTION */}
          {(result || error) && (
            <div className="bg-gray-50 p-8 border-t border-gray-200">
              {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center border border-red-200">
                  ❌ {error}
                </div>
              )}

              {result && (
                <div className={`text-center p-6 rounded-xl border-2 ${
                  result.status_kecocokan === 'Sangat Cocok' ? 'bg-green-50 border-green-200 text-green-800' :
                  result.status_kecocokan === 'Cukup Cocok' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                  'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <h3 className="text-2xl font-bold mb-2">{result.status_kecocokan}</h3>
                  <div className="text-4xl font-black mb-2">{result.persentase_kecocokan}</div>
                  <p className="opacity-80 text-sm mb-4">Kecocokan untuk {result.tanaman_target}</p>
                  <div className="bg-white/50 p-3 rounded-lg text-sm font-medium">
                    {result.deskripsi}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}