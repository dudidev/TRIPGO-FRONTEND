// shared-element.service.ts
import { Injectable } from '@angular/core';

export interface ElementSnapshot {
  rect: DOMRect;
  imageUrl: string;
  key: string;
}

@Injectable({ providedIn: 'root' })
export class SharedElementService {
  private snapshot: ElementSnapshot | null = null;

  capture(el: HTMLElement, key: string, imageUrl: string) {
    this.snapshot = {
      rect: el.getBoundingClientRect(),
      imageUrl,
      key
    };
  }

  consume(): ElementSnapshot | null {
    const s = this.snapshot;
    this.snapshot = null;
    return s;
  }

  hasSnapshot(key: string): boolean {
    return this.snapshot?.key === key;
  }
}