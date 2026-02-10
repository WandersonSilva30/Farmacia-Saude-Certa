import { useEffect, useRef, useState } from "react";

interface MapComponentProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  address?: string;
  className?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

export default function MapComponent({
  latitude = -8.2592,
  longitude = -35.0919,
  title = "Farmácia Saude Certa",
  address = "R. Vinte e Seis, 05 - Cohab, Cabo de Santo Agostinho - PE, 54520-235",
  className = "w-full h-96",
}: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initAttempts = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const initializeMap = () => {
      try {
        if (!window.google || !window.google.maps) {
          if (initAttempts.current < 50) {
            initAttempts.current++;
            setTimeout(initializeMap, 100);
          } else {
            setError("Google Maps API não disponível");
            setIsLoading(false);
          }
          return;
        }

        // Criar um novo container para o mapa
        if (!containerRef.current) return;
        
        // Limpar conteúdo anterior
        containerRef.current.innerHTML = "";

        const mapInstance = new window.google.maps.Map(containerRef.current, {
          zoom: 16,
          center: { lat: latitude, lng: longitude },
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: true,
          zoomControl: true,
          disableDefaultUI: false,
        });

        mapRef.current = mapInstance;

        // Adicionar marcador
        const marker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          title: title,
        });

        // Criar info window
        const infoContent = document.createElement("div");
        infoContent.innerHTML = `
          <div style="padding: 10px; font-family: Arial, sans-serif; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #FF6600; font-size: 16px; font-weight: bold;">${title}</h3>
            <p style="margin: 0; color: #333; font-size: 13px; line-height: 1.4;">
              ${address}
            </p>
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent,
        });

        marker.addListener("click", () => {
          infoWindow.open(mapInstance, marker);
        });

        // Abrir info window por padrão
        infoWindow.open(mapInstance, marker);
        setIsLoading(false);
      } catch (err) {
        console.error("Erro ao inicializar mapa:", err);
        setError("Erro ao carregar o mapa");
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      // Cleanup: remover referências
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, title, address]);

  if (error) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center rounded-lg`}>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        borderRadius: "0.5rem",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        backgroundColor: isLoading ? "#e5e7eb" : "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading && <p className="text-gray-500 text-sm">Carregando mapa...</p>}
    </div>
  );
}
