import { Injectable } from '@angular/core';

export type SearchKind = 'lugar' | 'categoria';

export type SearchResult = {
  kind: SearchKind;
  title: string;     // nombre visible (establecimiento o tipo)
  subtitle: string;  // texto pequeño (town, dirección, etc.)
  img?: string;

  // navegación / contexto
  route: any[];      // comandos router base
  townSlug?: string;
  tipoId?: number;
  lugarId?: number;
};

export type SearchScope = {
  townSlug?: string;
  kinds?: SearchKind[];
};

type EstablecimientoRaw = any;
type TipoRaw = { id_tipo: number; nombre_tipo: string };

@Injectable({ providedIn: 'root' })
export class SearchService {
  private index: SearchResult[] = [];
  private ready = false;

  setFromBackend(establecimientos: EstablecimientoRaw[], tipos: TipoRaw[] = []) {
    const list = Array.isArray(establecimientos) ? establecimientos : [];
    const tiposList = Array.isArray(tipos) ? tipos : [];

    // id_tipo -> nombre_tipo
    const tipoMap = new Map<number, string>();
    for (const t of tiposList) {
      const id = Number((t as any)?.id_tipo);
      const nombre = String((t as any)?.nombre_tipo ?? '').trim();
      if (!Number.isNaN(id) && nombre) tipoMap.set(id, nombre);
    }

    const results: SearchResult[] = [];
    const categoriasKeySet = new Set<string>(); // evita duplicados por town+tipo

    for (const raw of list) {
      const lugarId = raw?.id_establecimiento ?? raw?.id ?? null;
      if (lugarId == null) continue;

      const nombreLugar = String(raw?.nombre_establecimiento ?? raw?.nombre ?? 'Sin nombre').trim();
      const direccion = String(raw?.direccion ?? '').trim();
      const town = String(raw?.ubicacion ?? raw?.town ?? '').toLowerCase().trim();

      const tipoId = Number(raw?.tipo ?? raw?.id_tipo ?? NaN);

      // nombre del tipo: primero del endpoint /tipos, si no viene, intenta raw.nombre_tipo, si no, vacío
      const nombreTipo =
        (Number.isNaN(tipoId) ? '' : (tipoMap.get(tipoId) ?? '')) ||
        String(raw?.nombre_tipo ?? '').trim();

      const img =
        raw?.img ??
        raw?.imagen ??
        raw?.imagen_url ??
        raw?.foto ??
        raw?.foto_url ??
        raw?.portada ??
        raw?.url ??
        undefined;

      // 1) LUGAR
      // ✅ metemos nombreTipo en el subtitle para que buscar "glamping" encuentre establecimientos glamping
      const subtitleLugar = [nombreTipo, town, direccion].filter(Boolean).join(' • ') || 'Lugar';

      results.push({
        kind: 'lugar',
        title: nombreLugar,
        subtitle: subtitleLugar,
        img: img ? String(img) : undefined,
        route: ['/detalles', String(lugarId)],
        townSlug: town || undefined,
        tipoId: Number.isNaN(tipoId) ? undefined : tipoId,
        lugarId: Number(lugarId),
      });

      // 2) CATEGORÍA (TIPO)
      if (town && !Number.isNaN(tipoId)) {
        const titleTipo = nombreTipo || `Categoría ${tipoId}`;
        const key = `${town}::${tipoId}`;

        if (!categoriasKeySet.has(key)) {
          categoriasKeySet.add(key);

          results.push({
            kind: 'categoria',
            title: titleTipo,             // ✅ “Glamping”
            subtitle: `${town} • Categoría`,
            route: ['/lugares', town],    // ✅ base route
            townSlug: town,
            tipoId,
          });
        }
      }
    }

    this.index = results;
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  search(query: string, limit = 12, scope: SearchScope = {}) {
    const q = this.normalize(query);
    if (!q) return [];

    let base = this.index;

    if (scope.townSlug) base = base.filter(r => r.townSlug === scope.townSlug);
    if (scope.kinds?.length) base = base.filter(r => scope.kinds!.includes(r.kind));

    return base
      .map(r => ({ r, score: this.scoreMatch(q, `${r.title} ${r.subtitle}`) }))
      .filter(x => x.score > 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(x => x.r);
  }

  private normalize(text: string): string {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private scoreMatch(query: string, text: string): number {
    const q = this.normalize(query);
    const t = this.normalize(text);
    if (!q || !t) return 0;

    if (t === q) return 100;
    if (t.includes(q)) return 90;

    const qTokens = q.split(' ');
    const tTokens = t.split(' ');

    let score = 0;

    for (const qt of qTokens) {
      if (!qt) continue;

      if (tTokens.some(tt => tt.includes(qt))) {
        score += 20;
        continue;
      }

      let best = Infinity;
      for (const tt of tTokens) best = Math.min(best, this.damerauLevenshtein(qt, tt));

      const maxDist = Math.min(4, Math.ceil(qt.length * 0.35));
      if (best <= maxDist) score += Math.max(0, 18 - best * 4);
    }

    return score;
  }

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
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );

        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + cost);
        }
      }
    }
    return dp[m][n];
  }
}