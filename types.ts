
export enum Category {
  Agriturismo = "Agriturismo",
  AziendaAgricola = "Azienda Agricola",
  Agricampeggio = "Agricampeggio"
}

export interface Farm {
  id: string;
  name: string;
  category: string; // Flessibile per gestire i dati dinamici dell'Excel
  comune: string;
  lat: number;
  lng: number;
  description: string;
  imageUrl: string; // Header
  logoUrl?: string; // Logo aziendale
  gallery: string[]; // foto1, foto2
  products: string[];
  isAvailable: boolean;
  tags: string[];
  address: string;
  phone: string;
  website: string;
  portalUrl?: string; // Link portale per QR
  hours?: string; // Orari
  socials: {
    fb?: string;
    ig?: string;
    email?: string;
  };
}
