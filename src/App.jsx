import {
  Droplets,
  Star,
  Users,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";

/** */

function App() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800 overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div
        className="fixed bottom-20 left-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-16 pt-20 pb-32">
        <div className="text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-800 text-sm font-medium mb-4 animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>Madu Asli 100% dari Kuningan</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
            PT Imah Teuweul
            <br />
            Indonesia
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Produsen madu asli berkualitas premium dengan program reseller
            menguntungkan dan sistem poin pembelian
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <a
              href="#produk"
              className="group px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Lihat Produk
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#reseller"
              className="px-8 py-4 rounded-full bg-white border-2 border-orange-500 text-orange-600 shadow-lg font-bold text-lg hover:bg-orange-50 hover:scale-105 transition-all duration-300"
            >
              Gabung Reseller
            </a>
          </div>
        </div>

        {/* Floating stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
          {[
            { icon: Users, label: "Reseller Aktif", value: "500+" },
            { icon: Star, label: "Rating Produk", value: "4.9/5" },
            { icon: Award, label: "Tahun Berpengalaman", value: "10+" },
            { icon: TrendingUp, label: "Produk Terjual", value: "50K+" },
          ].map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <IconComponent className="w-8 h-8 text-amber-600 mx-auto mb-3" />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Products Section */}
      <section
        id="produk"
        className="relative max-w-7xl mx-auto px-6 md:px-16 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Produk Unggulan Kami
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Berbagai pilihan madu berkualitas dengan manfaat kesehatan terbaik
            dari peternakan lebah lokal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Madu Mellifera",
              desc: "Madu murni dari lebah Apis mellifera, kaya antioksidan",
              color: "from-amber-400 to-amber-600",
            },
            {
              name: "Madu Odeng",
              desc: "Madu tradisional dengan khasiat alami yang luar biasa",
              color: "from-orange-400 to-orange-600",
            },
            {
              name: "Madu Teuweul",
              desc: "Madu khas lokal dengan rasa manis yang autentik",
              color: "from-yellow-400 to-amber-600",
            },
            {
              name: "Madu Habbatussauda",
              desc: "Kombinasi madu dan habbatussauda untuk kesehatan",
              color: "from-amber-500 to-orange-700",
            },
          ].map((product, i) => (
            <div
              key={i}
              className="group relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              ></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="w-8 h-8 text-amber-700" />
                </div>

                <h3 className="font-bold text-2xl mb-3 text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.desc}
                </p>

                <div className="flex items-center text-amber-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Pelajari lebih lanjut</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-12 md:p-16 shadow-2xl text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl opacity-90">
              Keuntungan menjadi bagian dari keluarga Imah Teuweul
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Asli",
                desc: "Madu murni tanpa campuran gula atau bahan kimia",
              },
              {
                title: "Harga Terjangkau",
                desc: "Kualitas premium dengan harga yang kompetitif",
              },
              {
                title: "Sistem Poin",
                desc: "Dapatkan poin setiap pembelian minimal Rp50.000",
              },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                <p className="opacity-90">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reseller CTA Section */}
      <section id="reseller" className="max-w-5xl mx-auto px-6 md:px-16 py-20">
        <div className="bg-white rounded-3xl p-12 md:p-16 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Bergabunglah Sebagai Reseller
            </h2>
            <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
              Dapatkan keuntungan menarik dan poin pembelian untuk setiap
              transaksi minimal Rp50.000
            </p>
            <p className="text-lg text-gray-500 mb-10">
              Sistem poin dapat ditukar dengan produk atau diskon khusus
            </p>

            <a
              href="https://wa.me/6280000000?text=Halo,%20saya%20ingin%20bergabung%20sebagai%20reseller"
              className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi via WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-amber-50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
          <h3 className="text-2xl font-bold mb-4">PT Imah Teuweul Indonesia</h3>
          <p className="opacity-80 mb-4">Madu Asli Berkualitas dari Kuningan</p>
          <p className="text-sm opacity-70">
            © 2025 PT Imah Teuweul Indonesia. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

export default App;
