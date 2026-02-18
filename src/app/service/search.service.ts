import { Injectable } from '@angular/core';
import { CATEGORIAS_DATA } from '../data/categorias.data';
import { LUGARES_DATA } from '../data/lugares.data';

export type SearchKind = 'categoria' | 'lugar' | 'itinerario';

export type SearchResult = {
  kind: SearchKind;
  title: string;
  subtitle: string;
  img?: string;
  route: any[];
  townSlug?: string;
  categoryKey?: string;
  };
  export type SearchScope = {
    townSlug?: string;
    categoryKey?: string;
    kinds?: SearchKind[]; // opcional si luego quieres filtrar por tipo
  };


@Injectable({ providedIn: 'root' })
export class SearchService {

  private index: SearchResult[] = [];
  private built = false;

  private buildIndexOnce() {
    if (this.built) return;

    const results: SearchResult[] = [];

    // 1️⃣ Categorías + Itinerarios
    Object.entries(CATEGORIAS_DATA).forEach(([townSlug, town]) => {

      town.categorias.forEach(c => {
        results.push({
          kind: 'categoria',
          title: c.label,
          subtitle: `${town.nombre} • Categoría`,
          img: c.img,
          route: ['/lugares', townSlug, c.key],

          townSlug,
          categoryKey: c.key
        });
      });

      town.itinerarios.forEach((it, i) => {
        results.push({
          kind: 'itinerario',
          title: it.titulo,
          subtitle: `${town.nombre} • Itinerario ${i + 1}`,
          img: it.img,
          route: ['/categorias', townSlug],
           townSlug


        });
      });

    });
    

    // Lugares
    Object.entries(LUGARES_DATA).forEach(([townSlug, byCat]) => {
      Object.entries(byCat).forEach(([categoryKey, cat]) => {

        cat.items.forEach(item => {
          results.push({
            kind: 'lugar',
            title: item.titulo,
            subtitle: `${townSlug} • ${cat.titulo}`,
            img: item.img,
            route: ['/detalles', item.slug], 
             townSlug,
             categoryKey
          });
        });

      });
    });

    this.index = results;
    this.built = true;
  }

  search(query: string, limit = 12, scope: SearchScope = {}) {
  this.buildIndexOnce();

  const q = this.normalize(query);
  if (!q) return [];

  // ✅ 1) aplicar scope/contexto
  let base = this.index;

  if (scope.townSlug) {
    base = base.filter(r => r.townSlug === scope.townSlug);
  }

  if (scope.categoryKey) {
    base = base.filter(r => r.categoryKey === scope.categoryKey);
  }

  if (scope.kinds?.length) {
    base = base.filter(r => scope.kinds!.includes(r.kind));
  }

  const scored = base
    .map(r => {
      const hay = `${r.title} ${r.subtitle}`;
      const score = this.scoreMatch(q, hay);
      return { r, score };
    })
    .filter(x => x.score > 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.r);

  return scored;
}


  group(results: SearchResult[]) {
    return {
      categorias: results.filter(r => r.kind === 'categoria'),
      lugares: results.filter(r => r.kind === 'lugar'),
      itinerarios: results.filter(r => r.kind === 'itinerario'),
    };
  }

  // ==============================
  // TEXT NORMALIZATION
  // ==============================
  private normalize(text: string): string {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // ==============================
  // FUZZY MATCH SCORE
  // ==============================
  private scoreMatch(query: string, text: string): number {
  const q = this.normalize(query);
  const t = this.normalize(text);
  if (!q || !t) return 0;

  // match exacto / contiene
  if (t === q) return 100;
  if (t.includes(q)) return 90;

  const qTokens = q.split(' ');
  const tTokens = t.split(' ');

  let score = 0;

  for (const qt of qTokens) {
    if (!qt) continue;

    // si alguna palabra contiene el token (aunque sea parcial)
    if (tTokens.some(tt => tt.includes(qt))) {
      score += 20;
      continue;
    }

    // fuzzy: busca la palabra más parecida
    let best = Infinity;
    for (const tt of tTokens) {
      const d = this.damerauLevenshtein(qt, tt);
      if (d < best) best = d;
    }

    // ✅ tolerancia dinámica: 35% de la longitud (máx 4)
    const maxDist = Math.min(4, Math.ceil(qt.length * 0.35));

    if (best <= maxDist) {
      // mientras más parecido, más puntos
      score += Math.max(0, 18 - best * 4);
    }
  }

  return score;
}

  // ==============================
  // LEVENSHTEIN DISTANCE
  // ==============================
private damerauLevenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // borrar
        dp[i][j - 1] + 1,      // insertar
        dp[i - 1][j - 1] + cost // sustituir
      );

      // ✅ transposición (letras invertidas)
      if (
        i > 1 && j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
      }
    }
  }

  return dp[m][n];
}


}
