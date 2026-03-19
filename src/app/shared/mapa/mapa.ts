import { Component, AfterViewInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mapWrap" (click)="openGoogleMaps()">
      <div id="map" class="map"></div>
      <div class="mapHint" *ngIf="openOnClick">
        Ver en Google Maps ↗
      </div>
    </div>
  `,
  styles: [`
    .mapWrap {
      position: relative;
      width: 100%;
      height: 320px;
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
    }
    .map {
      width: 100%;
      height: 100%;
    }
    .mapHint {
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
  @Input() label = 'Ubicación';
  @Input() openOnClick = true;

  private map!: L.Map;

  ngAfterViewInit(): void {
    if (this.map) return;

    this.map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
      boxZoom: false,
      keyboard: false,
    }).setView([this.lat, this.lng], this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    // 👇 Icono personalizado con el logo de TripGo
    const tripgoIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          width: 37px;
          height: 37px;
          border-radius: 50%;
          background: #0E6973;
          border: 2px solid #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <img
            src="https://res.cloudinary.com/dtyvd3fim/image/upload/v1764678577/ChatGPT_Image_12_nov_2025_17_33_14_1_hj26hs.png"
            style="margin-top: 4px; width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"
          />
          <div style="
            position: absolute;
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            border-top: 9px solid #0E6973;
          "></div>
        </div>
      `,
      iconSize: [46, 54],
      iconAnchor: [23, 54],
      tooltipAnchor: [0, -54],
    });

    L.marker([this.lat, this.lng], { icon: tripgoIcon })
      .addTo(this.map)
      .bindTooltip(this.label, { direction: 'top', offset: [0, -10] });

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