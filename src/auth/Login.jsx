import React from "react";
import { motion } from "framer-motion";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-[#C9A24A]/20 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 border border-[#C9A24A]/40"
      >
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-extrabold tracking-wide"
            style={{ color: "#080808ff" }}
          >
            Welcome Back
          </h1>
          <p className="text-sm mt-2 text-gray-600">
            Masukkan akun untuk melanjutkan
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
              Password
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
            style={{ backgroundColor: "#C9A24A", color: "#000000" }}
          >
            Masuk
          </motion.button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Lupa password?{" "}
          <span className="text-[#C9A24A] font-semibold cursor-pointer">
            Reset
          </span>
        </div>
      </motion.div>
    </div>
  );
}
