export interface Certification {
    name: string;
    icon: string;
    url: string;
    level?: "Advanced" | "Intermediate" | "Introductory";
    type?: "Cours" | "Examen";
    provider: "google" | "cisco";
    date?: string;
    shape?: "round" | "rectangle";
    counter?: number;
}

export interface CertificationCategory {
    name: string;
    items: Certification[];
}