import {
  Droplets,
  Star,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const [expandedProduct, setExpandedProduct] = useState(null);

  const toggleDescription = (index) => {
    setExpandedProduct(expandedProduct === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-[#C9A24A]/10 to-white text-[#080808ff] overflow-hidden">

      {/* 🔹 Header */}
      <header className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md z-50 shadow-md border-b border-[#C9A24A]/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-16 py-4">
          <a href="/">
            <img
              rel="icon" 
              type="image/svg+xml"
              src="/icon.svg"
              alt="PT Imah Teuweul Indonesia"
              className="h-12 w-auto hover:opacity-90 transition"
            />
          </a>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold rounded-full border-2 border-[#C9A24A] text-[#C9A24A] hover:bg-[#C9A24A]/10 transition-all"
              >
                Sign In
              </Link>
              
              <Link
                to="/signup"
                className="px-6 py-2 text-sm font-bold rounded-full bg-[#C9A24A] text-white shadow hover:brightness-110 hover:scale-105 transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for header */}
      <div className="h-24"></div>

      {/* Decorative background elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-[#C9A24A]/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div
        className="fixed bottom-20 left-10 w-96 h-96 bg-[#C9A24A]/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-16 pt-20 pb-32">
        <div className="text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A24A]/20 rounded-full text-[#C9A24A] text-sm font-medium mb-4 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>Madu Asli 100% dari Kuningan</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            style={{ color: "#080808ff" }}
          >
            PT Imah Teuweul <br /> Indonesia
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Produsen madu premium dengan sistem poin reseller yang menguntungkan
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <a
              href="#produk"
              className="group px-8 py-4 rounded-full bg-[#C9A24A] text-white shadow-lg font-bold text-lg hover:brightness-110 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Lihat Produk
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="/signup"
              className="px-8 py-4 rounded-full border-2 border-[#C9A24A] text-[#C9A24A] shadow-md font-bold text-lg hover:bg-[#C9A24A]/10 hover:scale-105 transition-all duration-300"
            >
              Gabung Reseller
            </a>
          </div>
        </div>

        {/* Floating stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
          {[
            { icon: Users, label: "Reseller Aktif", value: "10+" },
            { icon: Star, label: "Rating Produk", value: "4.9/5" },
            { icon: Award, label: "Tahun Berpengalaman", value: "5+" },
            { icon: TrendingUp, label: "Produk Terjual", value: "50K+" },
          ].map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <IconComponent className="w-8 h-8 text-[#C9A24A] mx-auto mb-3" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Section */}
      <section id="produk" className="relative max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Produk Unggulan Kami</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pilihan madu asli untuk kesehatan terbaik Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Madu Mellifera",
              desc: "Madu yang berasal dari lebah Apis mellifera dan memiliki karakteristik rasa yang lebih manis dengan tekstur yang relative cair. Madu Mellifera menjadi salah satu produk produk yang cocok dikonsumsi sehari-hari dan banyak diminati",
              shortDesc: "Madu yang berasal dari lebah Apis mellifera dengan rasa manis dan tekstur cair, cocok untuk konsumsi sehari-hari.",
              image: "/mm.webp" 
            },
            {
              name: "Madu Odeng",
              desc: "Madu Odeng merupakan madu khas yang berasal dari lebah hutan dan memiliki cita rasa lebih kuat serta aroma khas. Produk ini banyak dicari karena dipercaya memiliki manfaat yang baik dalam meningkatkan stamina dan kesehatan tubuh",
              shortDesc: "Madu khas dari lebah hutan dengan cita rasa kuat, baik untuk meningkatkan stamina dan kesehatan tubuh.",
              image: "/mo.webp"
            },
            {
              name: "Madu Teuweul",
              desc: "Madu Teuweul merupakan produk yang digunakan sebagai identitas perusahaan, disamping identitas perusahaan madu teuweul memiliki keunikan tersendiri karena dihasilkan dari lebah lokal dan memiliki proses fermentasi alami yang memberikan rasa dan aroma yang berbeda dari madu yang lainnya. Produk madu teuweul merupakan produk unggulan yang dimiliki oleh PT Imah Teuweul Indonesia karena manfaat yang dimiliki madu ini lebih banyak dibandingkan dengan madu yang lainnya.",
              shortDesc: "Produk unggulan dengan fermentasi alami dari lebah lokal, memiliki manfaat lebih banyak dibanding madu lainnya.",
              image: "/mt.webp"
            },
            {
              name: "Madu Habbatussauda",
              desc: "Madu Habbatussauda yang ada pada PT Imah Teuweul merupakan hasil kombinasi antara madu murni dengan habbatussauda (jintan hitam), yang diketahui memiliki khasiat dalam meningkatkan sistem kekebalan tubuh, memperbaiki metabolisme, serta mendukung kesehatan secara menyeluruh.",
              shortDesc: "Kombinasi madu murni dengan habbatussauda untuk meningkatkan sistem kekebalan tubuh dan metabolisme.",
              image: "/mh.webp"
            },
          ].map((product, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
            >
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-[#C9A24A]/10 to-[#B8933D]/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-20 h-20 text-[#C9A24A]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                    `;
                  }}
                />
              </div>

              {/* Content - Flexible Height */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-xl mb-3 text-gray-900 group-hover:text-[#C9A24A] transition-colors">
                  {product.name}
                </h3>
                
                {/* Description with Read More */}
                <div className="mb-4 flex-grow">
                  <p className="text-gray-600 text-sm leading-relaxed text-justify">
                    {expandedProduct === i ? product.desc : product.shortDesc}
                  </p>
                  
                  {product.desc.length > product.shortDesc.length && (
                    <button
                      onClick={() => toggleDescription(i)}
                      className="mt-2 text-[#C9A24A] text-xs font-semibold hover:text-[#B8933D] transition-colors flex items-center gap-1"
                    >
                      {expandedProduct === i ? "Tutup" : "Selengkapnya"}
                      <ChevronDown 
                        className={`w-3 h-3 transition-transform duration-300 ${
                          expandedProduct === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#080808ff] text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
          <h3 className="text-2xl font-bold mb-2">PT Imah Teuweul Indonesia</h3>
          <p className="opacity-80 mb-4 text-sm">
            Madu Asli Berkualitas dari Kuningan
          </p>
          <p className="text-xs opacity-50 mb-2">
            © 2025 PT Imah Teuweul Indonesia — All Rights Reserved
          </p>

          {/* Designed By */}
          <p className="text-xs opacity-60 mt-1">
            Designed by <span className="font-semibold">LinioDev</span>
          </p>
        </div>
      </footer>

    </main>
  );
};

export default Dashboard;