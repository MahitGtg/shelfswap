import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "./api";
import type { User } from "./types";

// The user switcher stands in for real authentication. "Who am I" is just whoever
// is selected here. Replacing this with real sign-up / log-in is a workshop job.
interface CurrentUserContext {
  users: User[];
  current: User | null;
  setCurrent: (user: User) => void;
}

const Context = createContext<CurrentUserContext>({
  users: [],
  current: null,
  setCurrent: () => {},
});

export const useCurrentUser = () => useContext(Context);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState<User | null>(null);

  useEffect(() => {
    api<User[]>("/api/users")
      .then((u) => {
        setUsers(u);
        setCurrent(u[0] ?? null);
      })
      .catch(() => {
        /* backend not running yet; the UI shows an empty switcher */
      });
  }, []);

  return (
    <Context.Provider value={{ users, current, setCurrent }}>
      {children}
    </Context.Provider>
  );
}
