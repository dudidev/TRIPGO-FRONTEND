import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Nav } from '../../shared/nav/nav';
import { Footer } from '../../shared/footer/footer';

type Plan = {
  name: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, Nav, Footer],
  templateUrl: './prices.html',
  styleUrls: ['./prices.css']
})
export class Prices {
  billing: 'monthly' | 'yearly' = 'monthly';

  plans: Plan[] = [
    {
      name: 'Starter',
      badge: 'Para empezar',
      priceMonthly: 40000,
      priceYearly: 260000,
      description: 'Ideal para un emprendimiento pequeño que quiere aparecer y recibir contactos.',
      features: [
        'Perfil básico (logo, descripción, fotos)',
        'Ubicación en mapa',
        'Enlace a WhatsApp y redes',
        'Aparecer en búsquedas básicas',
        'Soporte por correo'
      ],
      cta: 'Quiero Starter'
    },
    {
      name: 'Pro',
      badge: 'Más vendido',
      priceMonthly: 99000,
      priceYearly: 350000,
      description: 'Para negocios que quieren más visibilidad y conversiones.',
      features: [
        'Todo lo de Starter',
        'Galería ampliada + destacados',
        'Prioridad en resultados dentro del destino',
        'Sección de promociones',
        'Estadísticas básicas (vistas/clics)',
        'Soporte prioritario'
      ],
      cta: 'Quiero Pro',
      highlighted: true
    },
    {
      name: 'Premium',
      badge: 'Máxima visibilidad',
      priceMonthly: 150000,
      priceYearly: 500000,
      description: 'Para marcas que quieren dominar su categoría y destacar siempre.',
      features: [
        'Todo lo de Pro',
        'Destacado fijo por categoría',
        'Campañas de promoción (banner / home)',
        'Asesoría de optimización del perfil',
        'Soporte VIP'
      ],
      cta: 'Quiero Premium'
    }
  ];

  getPrice(plan: Plan): number {
    return this.billing === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  }
  contact(planName?: string) {
    const base = 'Hola, estoy interesado en un plan para publicar mi emprendimiento en TripGo.';
    const msg = planName ? `${base} Plan: ${planName}.` : base;
    const phone = '573005051548';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }
}