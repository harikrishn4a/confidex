// apps/lynx-app/App.tsx
import { useEffect, useState, useCallback } from '@lynx-js/react';
import { getTotalFlags } from './lib/api.js';

export function App(props: { onRender?: () => void }) {
  const [totalFlags, setTotalFlags] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  // fetch + polling
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const n = await getTotalFlags();
      setTotalFlags(n);
      setError(null);
      setLastUpdated(new Date().toLocaleString());
    } catch (e: any) {
      setError("Failed to load");
      if (totalFlags === null) setTotalFlags(0);
    } finally {
      setLoading(false);
    }
  }, [totalFlags]);

  useEffect(() => {
    props.onRender?.();
    load();
    const t = setInterval(load, 10_000);
    return () => clearInterval(t);
  }, [load]);

  // simple “button” View
  const RefreshButton = (
    <view
      bindtap={load}
      style={{
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        borderWidth: 1,
        borderRadius: 10,
      }}
    >
      <text style={{ fontWeight: '600' }}>{loading ? 'Refreshing…' : 'Refresh'}</text>
    </view>
  );

  // KPI Card component
  const KpiCard = ({
    label,
    value,
    hint,
  }: {
    label: string;
    value: string | number;
    hint?: string;
  }) => (
    <view
      style={{
        flexBasis: '48%',
        padding: 14,
        borderWidth: 1,
        borderRadius: 12,
        gap: 6,
        marginBottom: 12,
      }}
    >
      <text style={{ fontSize: 12, opacity: 0.8 }}>{label}</text>
      <text style={{ fontSize: 28, fontWeight: '700' }}>{value}</text>
      {hint ? <text style={{ fontSize: 12, opacity: 0.7 }}>{hint}</text> : null}
    </view>
  );

  return (
    <view style={{ flex: 1 }}>
      {/* Header */}
      <view
        style={{
          paddingTop: 75,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
          borderBottomWidth: 1,
        }}
      >
        <text style={{ fontSize: 20, fontWeight: '700' }}>Security Agent Dashboard</text>
        <view style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <text style={{ fontSize: 12, opacity: 0.7 }}>
            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Loading…'}
          </text>
          {RefreshButton}
        </view>
        {error && (
          <view style={{ marginTop: 10, padding: 8, borderWidth: 1, borderRadius: 8 }}>
            <text style={{ color: 'tomato' }}>{error}</text>
          </view>
        )}
      </view>

      {/* KPI Grid */}
      <view style={{ padding: 16 }}>
        <view style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <KpiCard
            label="Total Flags"
            value={totalFlags === null ? (loading ? '—' : 0) : totalFlags}
            hint="Count of rows in flagged_data"
          />

          {/* Ready for more KPIs later; examples shown as placeholders */}
          <KpiCard label="Blocks" value="—" hint="Wire when endpoint ready" />
          <KpiCard label="Redactions" value="—" hint="Wire when endpoint ready" />
          <KpiCard label="Allow Rate" value="—" hint="Wire when endpoint ready" />
        </view>

        {/* Section placeholder for future tables/charts */}
        <view style={{ marginTop: 12, padding: 14, borderWidth: 1, borderRadius: 12, gap: 6 }}>
          <text style={{ fontWeight: '700' }}>Recent Incidents</text>
          <text style={{ opacity: 0.7, fontSize: 12 }}>
            Hook this to your events endpoint or Datasette query when ready.
          </text>
        </view>
      </view>
    </view>
  );
}
