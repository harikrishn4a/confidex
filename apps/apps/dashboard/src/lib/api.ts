// apps/lynx-app/src/lib/api.ts

const API =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.API_BASE) ||
  (typeof process !== 'undefined' && (process.env as any).API_BASE);

const DB =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.DB_NAME) ||
  (typeof process !== 'undefined' && (process.env as any).DB_NAME);

export async function getTotalFlags(): Promise<number> {
  if (!API) throw new Error('API_BASE not set');

  // Datasette route (when DB_NAME is provided)
  if (DB) {
    const sql = encodeURIComponent('SELECT COUNT(*) AS total_flags FROM flagged_data');
    const url = `${API}/${DB}.json?sql=${sql}&_shape=array`;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`total_flags HTTP ${r.status}`);
    const rows = await r.json();
    return rows?.[0]?.total_flags ?? 0;
  }

  // Custom Node/Express route
  const r = await fetch(`${API}/metrics/total-flags`);
  if (!r.ok) throw new Error(`total_flags HTTP ${r.status}`);
  const { total_flags } = await r.json();
  return total_flags ?? 0;
}
