import React, { useState } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setUserData } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userSnap = await getDoc(doc(db, "users", uid));

      if (userSnap.exists()) {
        const data = userSnap.data();

        setUserData(data); 

        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/resellers", { replace: true });
          }
        }, 500);
      } else {
        setError("Akun tidak ditemukan.");
      }

    } catch (error) {
      console.log("Login error:", error.code, error.message);
      setError("Email atau password salah.");
    }

  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-[#C9A24A]/20 to-white p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-[#C9A24A]/40 flex overflow-hidden"
      >

        {/* Left Image */}
        <div className="hidden md:flex w-1/2 bg-[#C9A24A] items-center justify-center p-6">
          <img 
            src="/logo.svg"
            alt="Ilustrasi Madu"
            className="rounded-xl shadow-lg border-2 border-[#C9A24A]/50"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 p-10">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold" style={{ color: "#080808ff" }}>
              Welcome Back
            </h1>
            <p className="text-sm mt-2 text-gray-600">
              Masukkan akun untuk melanjutkan
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block font-semibold mb-1 text-gray-800">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 transition"
                style={{ borderColor: "#C9A24A" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-800">Password</label>
              <div className="relative">
                  <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 pr-12"
                  style={{ borderColor: "#C9A24A" }}
                  />
                  <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                  ) : (
                      <Eye className="w-5 h-5 text-gray-600" />
                  )}
                  </button>
              </div>
          </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 text-lg font-semibold rounded-xl shadow-md"
              style={{ backgroundColor: "#C9A24A", color: "#fdfdfdff" }}
            >
              Masuk
            </motion.button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-600">
            Belum Punya Akun?{" "}
            <span className="text-[#C9A24A] font-semibold cursor-pointer" onClick={() => navigate("/signup")}>
                Daftar disini!
            </span>
          </div>

          <div className="text-center mt-6 text-sm text-gray-600">
            Lupa password?{" "}
            <span className="text-[#C9A24A] font-semibold cursor-pointer" onClick={() => navigate("/forgot-password")}>
                Reset
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
