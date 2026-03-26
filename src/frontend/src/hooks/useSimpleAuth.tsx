import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ADMIN_EMAIL = "akhileshsavali18@gmail.com";
const ADMIN_PASSWORD = "Theakhilesh18@";
const STORAGE_KEY = "cricflash_admin_session";

type SimpleAuthContext = {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const Context = createContext<SimpleAuthContext | undefined>(undefined);

export function SimpleAuthProvider({ children }: PropsWithChildren) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "admin_authenticated";
    } catch {
      return false;
    }
  });

  const login = useCallback((email: string, password: string): boolean => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL &&
      password === ADMIN_PASSWORD
    ) {
      try {
        localStorage.setItem(STORAGE_KEY, "admin_authenticated");
      } catch {}
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, login, logout }),
    [isAdmin, login, logout],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSimpleAuth(): SimpleAuthContext {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("useSimpleAuth must be used within SimpleAuthProvider");
  return ctx;
}
