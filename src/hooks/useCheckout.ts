import { useState } from 'react';
import type { CheckoutResult } from '../types/checkout';

export function useCheckout() {
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  const runCheckout = async (): Promise<void> => {
    const startedAt = performance.now();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority: 'medium' }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? `Checkout failed: ${response.status}`);
      }
      setResult((await response.json()) as CheckoutResult);
      setElapsedMs(Math.round(performance.now() - startedAt));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, elapsedMs, runCheckout };
}
