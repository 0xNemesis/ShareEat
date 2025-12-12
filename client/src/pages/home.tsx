import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowRight, Leaf, ShieldCheck, Store } from "lucide-react";
import communityImage from "@assets/images/orang_makan.jpg";
import { useStore } from "@/lib/store";

export default function Home() {
  const { currentUser } = useStore();
  const [_, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (currentUser) {
      if (currentUser.role === "OWNER") setLocation("/owner-dashboard");
      else if (currentUser.role === "USER") setLocation("/explore");
      else setLocation("/volunteer-dashboard");
    } else {
      setLocation("/auth");
    }
  };

  return (
    <div className="flex flex-col gap-16 pb-12">
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl mx-auto w-full max-w-7xl">
        <img 
          src={communityImage} 
          alt="Community Sharing Food" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center">
          <div className="container mx-auto px-8 md:px-12">
            <div className="max-w-xl text-white space-y-6 animate-in slide-in-from-left-10 duration-700 fade-in">
              <Badge className="bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-md mb-2">
                #StopFoodWaste
              </Badge>
              <h1 className="font-heading text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Selamatkan Makanan,<br/>
                <span className="text-primary">Sebarkan Kebahagiaan.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg">
                Terhubunglah dengan restoran lokal untuk menyelamatkan makanan berlebih agar tidak terbuang. Baik untuk bumi, luar biasa untuk komunitas Anda.
              </p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" onClick={handleGetStarted} className="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                  Mulai
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Link href="/about">
                  
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-bold mb-4">Bergabunglah dengan Gerakannya</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Baik Anda pemilik usaha, tetangga yang membutuhkan, atau tangan yang ingin membantu selalu ada tempat untuk Anda di ShareEat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Store className="h-10 w-10 text-secondary" />}
            title="Untuk Restoran"
            description="Kurangi biaya limbah dan dukung komunitas Anda dengan mendaftarkan makanan surplus untuk diambil."
            action="Bergabung Dengan Kami"
          />
          <FeatureCard 
            icon={<Leaf className="h-10 w-10 text-primary" />}
            title="Untuk Penerima"
            description="Temukan makanan lezat gratis dari tempat favorit di sekitar Anda. Cukup pesan dan ambil."
            action="Cari Makanan"
          />
          <FeatureCard 
            icon={<ShieldCheck className="h-10 w-10 text-blue-500" />}
            title="Untuk Volunteers"
            description="Bantu mendistribusikan makanan hasil penyelamatan dalam jumlah besar ke shelter dan komunitas yang membutuhkan."
            action="Ayo Membantu"
          />
        </div>
      </section>

      {/* Stats Mockup */}
      <section className="bg-neutral-900 text-white py-20 rounded-3xl overflow-hidden relative container mx-auto">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Stat number="15k+" label="Makanan Terselamatkan" />
            <Stat number="2.5k" label="User Aktif" />
            <Stat number="120+" label="Partner Restoran" />
            <Stat number="8t" label="CO2 Dicegah" />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, action }: { icon: React.ReactNode, title: string, description: string, action: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="mb-6 bg-neutral-50 w-16 h-16 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        {description}
      </p>
      <Button variant="link" className="p-0 h-auto font-semibold group">
        {action} <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  )
}

function Stat({ number, label }: { number: string, label: string }) {
  return (
    <div className="space-y-2">
      <div className="text-4xl md:text-5xl font-heading font-bold text-primary">{number}</div>
      <div className="text-gray-400 font-medium">{label}</div>
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}
