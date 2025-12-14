import React, { useState } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";


function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
        return setError("Semua field harus diisi!");
        }

        if (password !== confirmPassword) {
        return setError("Konfirmasi password tidak cocok!");
        }

        setIsLoading(true);

        try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            phonenumber: phonenumber,
            address: address,
            role: "reseller", 
            createdAt: serverTimestamp(),
            points: 0 
        });

        alert("Registrasi berhasil! Silakan login");
        navigate("/login");

        } catch (err) {
        console.error(err);
        setError("Password harus terdiri dari minimal 6 karakter dan email harus valid.");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-[#C9A24A]/20 to-white p-6">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl bg-white shadow-xl rounded-2xl border border-[#C9A24A]/40 flex overflow-hidden"
        >

            <div className="hidden md:flex w-1/2 bg-[#C9A24A] items-center justify-center p-6">
            <img 
                src="/logo.png"
                alt="Ilustrasi Madu"
                className="rounded-xl shadow-lg border-2 border-white"
            />
            </div>

            <div className="w-full md:w-1/2 p-10">

            <div className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">
                Daftar Akun Baru
                </h1>
                <p className="text-sm mt-2 text-gray-600">Mulai perjalanan sebagai reseller</p>
            </div>

            {error && (
                <p className="text-red-500 text-center text-sm mb-3">{error}</p>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
                <div>
                <label className="block font-semibold mb-1 text-gray-800">Nama</label>
                <input type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
                    style={{ borderColor: "#C9A24A" }}
                />
                </div>

                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Email</label>
                    <input type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
                        style={{ borderColor: "#C9A24A" }}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1 text-gray-800">No Telepon</label>
                    <input type="number"
                        value={phonenumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
                        style={{ borderColor: "#C9A24A" }}
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Address</label>
                    <input type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2"
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

                <div>
                    <label className="block font-semibold mb-1 text-gray-800">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 pr-12"
                        style={{ borderColor: "#C9A24A" }}
                        />
                        <button
                        type="button"
                        className="absolute right-3 top-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                        {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Eye className="w-5 h-5 text-gray-600" />
                        )}
                        </button>
                    </div>
                </div>

                <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isLoading}
                className="w-full py-3 text-lg font-semibold rounded-xl shadow-md"
                style={{ backgroundColor: "#C9A24A", color: "#fff" }}
                >
                {isLoading ? "Mendaftarkan..." : "Daftar"}
                </motion.button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-600">
                Sudah punya akun?{" "}
                <a href="/login" className="text-[#C9A24A] font-semibold">Masuk</a>
            </div>

            </div>

        </motion.div>
        </div>
    );
}

export default Register;
