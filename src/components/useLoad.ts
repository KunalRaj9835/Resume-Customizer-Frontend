"use client";
import { useCallback, useEffect, useState } from "react";
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T>(); const [error, setError] = useState<string>(); const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(() => { setLoading(true); setError(undefined); fn().then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, deps);
  useEffect(run, [run]);
  return { data, error, loading, reload: run };
}
