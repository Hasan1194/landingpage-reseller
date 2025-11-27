import React from "react";
import { motion } from "framer-motion";

function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-[#C9A24A]/20 to-white p-6">

        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-[#C9A24A]/40 flex overflow-hidden"
        >

        {/* 🔹 Bagian Gambar di Kiri */}
        <div className="hidden md:flex w-1/2 bg-[#C9A24A] items-center justify-center p-6">
            <img 
            src="/logo.png" 
            alt="Ilustrasi Madu"
            className="rounded-xl shadow-lg border-2 border-[#C9A24A]/50"
            />
        </div>

        {/* 🔹 Bagian Form di Kanan */}
        <div className="w-full md:w-1/2 p-10">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold" style={{ color: "#080808ff" }}>
                Daftar Akun Baru
                </h1>
                <p className="text-sm mt-2 text-gray-600">
                Buat akun untuk mulai bergabung sebagai reseller
                </p>
            </div>

            <form className="space-y-6">
                <div>
                <label className="block font-semibold mb-1 text-gray-800">
                    Username
                </label>
                <input
                    type="text"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#C9A24A" }}
                />
                </div>

                <div>
                <label className="block font-semibold mb-1 text-gray-800">
                    Email
                </label>
                <input
                    type="email"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#C9A24A" }}
                />
                </div>

                <div>
                <label className="block font-semibold mb-1 text-gray-800">
                    Password
                </label>
                <input
                    type="password"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#C9A24A" }}
                />
                </div>

                <div>
                <label className="block font-semibold mb-1 text-gray-800">
                    Konfirmasi Password
                </label>
                <input
                    type="password"
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                    style={{ borderColor: "#C9A24A" }}
                />
                </div>

                <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 text-lg font-semibold rounded-xl shadow-md"
                style={{ backgroundColor: "#C9A24A", color: "#fdfdfdff" }}
                >
                Daftar
                </motion.button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
                Sudah punya akun?{" "}
                <a href="/login" className="text-[#C9A24A] font-semibold">
                Masuk
                </a>
            </div>
            </div>
        </motion.div>
        </div>
    );
}

export default Register;
