import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSparta } from "@/shared/context/SpartaContext";
import { PageHeader } from "@/ui/components/ui/page-header";
import { FloatingNav, type FloatingNavItem } from "@/ui/components/ui/floating-nav";
import { Home, Dumbbell, ChefHat, User, ArrowLeft, X } from "lucide-react";
import { IMAGES } from "@/shared/constants/images";

/** 5 fotos da dieta (food1–4 + repetida para fechar 5) */
const GALLERY_FOOD_PHOTOS = [
  IMAGES.FOOD_1,
  IMAGES.FOOD_2,
  IMAGES.FOOD_3,
  IMAGES.FOOD_4,
  IMAGES.FOOD_1,
];

const DietPhotoGallery: React.FC = () => {
  const navigate = useNavigate();
  useSparta();
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const floatingNavItems: FloatingNavItem[] = [
    { icon: <Home />, label: "Início", onClick: () => navigate("/dashboard/student") },
    { icon: <Dumbbell />, label: "Treinos", onClick: () => navigate("/student/workouts") },
    { icon: <ChefHat />, label: "Dieta", onClick: () => navigate("/diet") },
    { icon: <User />, label: "Perfil", onClick: () => navigate("/dashboard/perfil") },
  ];

  return (
    <div className="min-h-screen bg-page-dark pb-24 flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <PageHeader
          title="Galeria de fotos"
          subtitle="5 fotos da dieta enviada"
          leftSlot={
            <button
              onClick={() => navigate("/diet")}
              className="text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-white/5 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="size-5" />
            </button>
          }
        />

        <div className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {GALLERY_FOOD_PHOTOS.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setLightboxPhoto(src)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <img
                  src={src}
                  alt={`Dieta ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/diet")}
              className="text-white/70 hover:text-white font-medium text-sm flex items-center gap-2"
            >
              Voltar para a dieta
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setLightboxPhoto(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-default"
        >
          <img
            src={lightboxPhoto}
            alt="Ampliar"
            className="max-w-full max-h-full object-contain rounded-lg cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 size-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>
      )}

      <FloatingNav items={floatingNavItems} position="bottom-center" />
    </div>
  );
};

export default DietPhotoGallery;
