import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

// ✅ Fix del marker SIN assets (usa CDN)
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mapWrap" (click)="openGoogleMaps()">
      <div id="map" class="map"></div>

      <!-- overlay suave para "Ver en Google Maps" -->
      <div class="mapHint" *ngIf="openOnClick">
        Ver en Google Maps ↗
      </div>
    </div>
  `,
  styles: [`
    .mapWrap{
      position: relative;
      width: 100%;
      height: 320px;
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
    }
    .map{
      width: 100%;
      height: 100%;
    }
    .mapHint{
      position: absolute;
      right: 12px;
      bottom: 12px;
      background: rgba(0,0,0,.55);
      color: #fff;
      font-weight: 800;
      font-size: 12px;
      padding: 8px 10px;
      border-radius: 999px;
      pointer-events: none;
      backdrop-filter: blur(4px);
    }
  `]
})
export class MapaComponent implements AfterViewInit {

  @Input() lat = 4.636;
  @Input() lng = -75.570;
  @Input() zoom = 14;

  // opcional: para tooltip/popup
  @Input() label = 'Ubicación';

  @Input() openOnClick = true;

  private map!: L.Map;

  ngAfterViewInit(): void {
    if (this.map) return;

        this.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,   // 🚫 quita zoom con rueda
      doubleClickZoom: true,   // 🚫 quita zoom con doble click
      dragging: true,          // 🚫 no se mueve el mapa
      boxZoom: false,
      keyboard: false,
    }).setView([this.lat, this.lng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    L.marker([this.lat, this.lng])
      .addTo(this.map)
      .bindTooltip(this.label, { direction: 'top', offset: [0, -10] });

    // ✅ click en el mapa (no solo en el wrapper)
    if (this.openOnClick) {
      this.map.on('click', () => this.openGoogleMaps());
    }
  }

  openGoogleMaps() {
    if (!this.openOnClick) return;
    const url = `https://www.google.com/maps?q=${this.lat},${this.lng}`;
    window.open(url, '_blank');
  }
}