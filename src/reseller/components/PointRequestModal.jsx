import React, { useState } from "react";
import { Upload, X, Send, Loader2, CheckCircle, Image } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { supabase } from "../../supabase/supabaseClient";
import { db } from "../../firebase/firebaseConfig";

// Fungsi untuk compress dan convert gambar ke WebP
const compressImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new window.Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Hitung ukuran baru (maksimal 800px untuk sisi terpanjang)
                let width = img.width;
                let height = img.height;
                const maxSize = 800;
                
                if (width > height && width > maxSize) {
                    height = (height * maxSize) / width;
                    width = maxSize;
                } else if (height > maxSize) {
                    width = (width * maxSize) / height;
                    height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw image ke canvas
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert ke WebP dengan quality 30
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Failed to convert image'));
                        }
                    },
                    'image/webp',
                    0.3 // Quality 30%
                );
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

export default function PointRequestModal({ currentUser, onClose }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [pointAmount, setPointAmount] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi tipe file
        if (!file.type.startsWith('image/')) {
            alert('File harus berupa gambar!');
            return;
        }

        // Validasi ukuran file (max 10MB untuk file asli)
        if (file.size > 10 * 1024 * 1024) {
            alert('Ukuran file maksimal 10MB!');
            return;
        }

        setSelectedImage(file);
        
        // Buat preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async () => {
        if (!selectedImage || !pointAmount || !description) {
            alert('Harap lengkapi semua field!');
            return;
        }

        if (parseInt(pointAmount) <= 0) {
            alert('Jumlah poin harus lebih dari 0!');
            return;
        }

        setLoading(true);

        try {
            // 1. Compress ke WebP
            console.log('Compressing image...');
            const compressedBlob = await compressImageToWebP(selectedImage);
            console.log('Compressed size:', compressedBlob.size);

            // 2. Generate unique filename dengan timestamp
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(7);
            const fileName = `${currentUser.uid}_${timestamp}_${randomStr}.webp`;
            const filePath = `point-requests/${fileName}`;

            console.log('Uploading to Supabase:', filePath);

            // 3. Upload ke Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("bukti-transfer")
                .upload(filePath, compressedBlob, {
                    contentType: "image/webp",
                    upsert: false,
                    cacheControl: '3600'
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw uploadError;
            }

            console.log('Upload success:', uploadData);

            // 4. Ambil public URL dengan cara yang benar
            const { data: urlData } = supabase.storage
                .from("bukti-transfer")
                .getPublicUrl(filePath);

            const imageUrl = urlData.publicUrl;
            
            console.log('Public URL:', imageUrl);

            // Validasi URL
            if (!imageUrl || imageUrl.includes('undefined')) {
                throw new Error('Invalid image URL generated');
            }

            // 5. Simpan metadata ke Firestore
            await addDoc(collection(db, "pointRequests"), {
                userId: currentUser.uid,
                pointAmount: parseInt(pointAmount),
                description: description.trim(),
                imageUrl: imageUrl,
                imagePath: filePath,
                status: "pending",
                createdAt: serverTimestamp(),
            });

            console.log('Firestore save success');

            setSuccess(true);
            
            // Auto close setelah 2 detik
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error("Submit error:", error);
            
            // Error message yang lebih spesifik
            let errorMessage = 'Gagal mengirim request. ';
            if (error.message) {
                errorMessage += error.message;
            } else if (error.error) {
                errorMessage += error.error;
            }
            
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Berhasil!</h3>
                    <p className="text-gray-600">Request poin Anda telah dikirim dan menunggu persetujuan admin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-[#C9A24A] to-[#B8933D] p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Request Tambah Poin</h2>
                            <p className="text-white/80 text-sm">Upload bukti untuk request poin</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
                        disabled={loading}
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Upload Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Upload Bukti Gambar *
                        </label>
                        
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#C9A24A] transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={loading}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium mb-1">
                                        Klik untuk upload gambar
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        PNG, JPG, atau WEBP (max 10MB)
                                    </p>
                                    <p className="text-gray-400 text-xs mt-2">
                                        Gambar akan otomatis dikompres ke format WebP
                                    </p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border-2 border-[#C9A24A]">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-64 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                                    disabled={loading}
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Point Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Jumlah Poin *
                        </label>
                        <input
                            type="number"
                            value={pointAmount}
                            onChange={(e) => setPointAmount(e.target.value)}
                            placeholder="Masukkan jumlah poin"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#C9A24A] focus:ring-2 focus:ring-[#C9A24A]/20 outline-none transition-all"
                            min="1"
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Keterangan *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Jelaskan alasan request poin (misal: pembelian produk, pencapaian target, dll)"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#C9A24A] focus:ring-2 focus:ring-[#C9A24A]/20 outline-none transition-all resize-none"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Catatan:</strong> Request poin Anda akan direview oleh admin. 
                            Anda akan mendapat notifikasi setelah request disetujui atau ditolak.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedImage || !pointAmount || !description}
                        className="w-full bg-gradient-to-r from-[#C9A24A] to-[#B8933D] text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Mengirim Request...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                <span>Kirim Request</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}