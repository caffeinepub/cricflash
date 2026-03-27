import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type ClassifiedMatches,
  type NormalizedMatch,
  getClassifiedMatches,
} from "../services/cricapi";

// Re-export for convenience
export type { NormalizedMatch };

interface MatchContextValue {
  classified: ClassifiedMatches;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const MatchContext = createContext<MatchContextValue>({
  classified: { live: [], upcoming: [], completed: [] },
  loading: true,
  error: null,
  refresh: () => {},
});

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [classified, setClassified] = useState<ClassifiedMatches>({
    live: [],
    upcoming: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async () => {
    setError(null);
    try {
      const data = await getClassifiedMatches();
      setClassified(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 90_000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  return (
    <MatchContext.Provider
      value={{ classified, loading, error, refresh: fetchMatches }}
    >
      {children}
    </MatchContext.Provider>
  );
}

export function useMatches() {
  return useContext(MatchContext);
}
