import React from 'react';

type Fees = {
  fastestFee?: number;
  halfHourFee?: number;
  hourFee?: number;
  economyFee?: number;
  minimumFee?: number;
};

type Metric<T = string | number | null> = {
  label: string;
  value: T;
  hint?: string;
};

type DifficultyLike = {
  currentDifficulty?: number;
  previousRetarget?: number;
  difficulty?: number;
  diff?: number;
  currDifficulty?: number;
};

const API_BASE = 'https://flokichain.info/api';

function useEconomy() {
  const [height, setHeight] = React.useState<Metric<number | null>>({ label: 'Height', value: null });
  const [fees, setFees] = React.useState<Metric<string | null>>({ label: 'Fee (fast)', value: null });
  const [subsidy, setSubsidy] = React.useState<Metric<string | null>>({ label: 'Subsidy', value: null, hint: undefined });
  const [nextHalving, setNextHalving] = React.useState<Metric<string | null>>({ label: 'Blocks to halving', value: null, hint: undefined });
  const [diffAdj, setDiffAdj] = React.useState<Metric<string | null>>({ label: 'Difficulty', value: null });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;

    async function fetchJSON<T>(url: string): Promise<T | null> {
      try {
        const r = await fetch(url, { signal });
        if (!r.ok) return null;
        return (await r.json()) as T;
      } catch {
        return null;
      }
    }

    async function fetchText(url: string): Promise<string | null> {
      try {
        const r = await fetch(url, { signal });
        if (!r.ok) return null;
        return await r.text();
      } catch {
        return null;
      }
    }

    async function load() {
      setLoading(true);

      const heightTxt = await fetchText(`${API_BASE}/blocks/tip/height`);
      const [feeObj, diffAdjObj, tipObj] = await Promise.all([
        fetchJSON<Fees>(`${API_BASE}/v1/fees/recommended`),
        fetchJSON<DifficultyLike>(`${API_BASE}/v1/difficulty-adjustment`),
        fetchJSON<DifficultyLike>(`${API_BASE}/blocks/tip`),
      ]);

      const h = heightTxt ? Number(heightTxt) : null;
      setHeight({ label: 'Height', value: Number.isFinite(h) ? h : null });

      const ff = feeObj?.fastestFee ?? feeObj?.halfHourFee ?? feeObj?.hourFee;
      setFees({ label: 'Fee (fast)', value: ff != null ? `${ff} loki/vB` : null, hint: ff != null ? 'recommended' : undefined });

      // Compute current subsidy and next halving locally
      if (h != null && Number.isFinite(h)) {
        const INITIAL = 1000;
        const INTERVAL = 210_000;
        const TAIL = 21;

        const epoch = Math.floor(h / INTERVAL);
        const raw = INITIAL / Math.pow(2, epoch);
        const current = raw < TAIL ? TAIL : raw;

        const formatSubsidy = (n: number) => {
          const r = Math.round(n * 100) / 100;
          return r % 1 === 0 ? r.toString() : r.toString();
        };
        setSubsidy({ label: 'Subsidy', value: `${formatSubsidy(current)} FLC` });

        if (current > TAIL) {
          const next = (epoch + 1) * INTERVAL;
          const remaining = Math.max(0, next - h);
          const etaMs = Date.now() + remaining * 60_000; // ~1 min blocks
          setNextHalving({ label: 'Blocks to halving', value: `${remaining}`, hint: new Date(etaMs).toLocaleDateString() });
        } else {
          setNextHalving({ label: 'Blocks to halving', value: 'Tail emission', hint: undefined });
        }
      } else {
        setSubsidy({ label: 'Subsidy', value: null });
        setNextHalving({ label: 'Blocks to halving', value: null });
      }

      const fmtNum = (n: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
      let prevDiff: number | undefined;
      if (h != null && Number.isFinite(h) && h > 0) {
        const prevHash = await fetchText(`${API_BASE}/block-height/${h - 1}`);
        if (prevHash) {
          const prevBlock = await fetchJSON<DifficultyLike>(`${API_BASE}/block/${prevHash}`);
          prevDiff = prevBlock?.difficulty ?? prevBlock?.diff ?? prevBlock?.currDifficulty;
        }
      }
      const diffFromAdj: number | undefined =
        diffAdjObj?.currentDifficulty ?? diffAdjObj?.previousRetarget ?? diffAdjObj?.difficulty;
      const diffFromTip: number | undefined = tipObj?.difficulty ?? tipObj?.diff ?? tipObj?.currDifficulty;
      const diffVal: number | null = (prevDiff ?? diffFromAdj ?? diffFromTip) ?? null;
      setDiffAdj({ label: 'Difficulty', value: diffVal != null ? fmtNum(diffVal) : null });

      setLoading(false);
    }

    load();
    const id = setInterval(load, 60_000);
    return () => {
      clearInterval(id);
      ac.abort();
    };
  }, []);

  return { height, fees, subsidy, nextHalving, diffAdj, loading };
}

export default function EconomyNow() {
  const { height, fees, subsidy, nextHalving, diffAdj, loading } = useEconomy();

  const items: Metric<string | number | null>[] = [height, subsidy, nextHalving, fees, diffAdj];

  return (
    <dl className="economyNow" aria-live="polite">
      {items.map((m) => (
        <div key={m.label} className={`economyNow__cell ${loading ? 'is-loading' : ''}`}>
          <dt className="economyNow__label">{m.label}</dt>
          <dd className="economyNow__value">
            {m.value != null ? m.value : <span className="economyNow__skeleton" />}
            {m.hint && m.value != null ? <span className="economyNow__hint">{m.hint}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
