"use client";

/**
 * Cart state. Persistence is behind the CartStorage abstraction (DIP) so
 * localStorage can be replaced by a database-backed store for logged-in users.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartLine } from "@/domain/order";

export interface CartStorage {
  load(): CartLine[];
  save(lines: CartLine[]): void;
}

export const localCartStorage: CartStorage = {
  load() {
    try {
      const raw = window.localStorage.getItem("bluekick.cart");
      return raw ? (JSON.parse(raw) as CartLine[]) : [];
    } catch {
      return [];
    }
  },
  save(lines) {
    window.localStorage.setItem("bluekick.cart", JSON.stringify(lines));
  },
};

interface CartApi {
  lines: CartLine[];
  count: number;
  ready: boolean;
  add(productId: string, quantity?: number): void;
  setQuantity(productId: string, quantity: number): void;
  remove(productId: string): void;
  clear(): void;
}

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children, storage = localCartStorage }: { children: ReactNode; storage?: CartStorage }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate from storage after mount to avoid server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(storage.load());
    setReady(true);
  }, [storage]);

  useEffect(() => {
    if (ready) storage.save(lines);
  }, [lines, ready, storage]);

  const add = useCallback((productId: string, quantity = 1) => {
    setLines((cur) => {
      const found = cur.find((l) => l.productId === productId);
      if (found) return cur.map((l) => (l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l));
      return [...cur, { productId, quantity }];
    });
  }, []);
  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((cur) => (quantity < 1 ? cur.filter((l) => l.productId !== productId) : cur.map((l) => (l.productId === productId ? { ...l, quantity } : l))));
  }, []);
  const remove = useCallback((productId: string) => setLines((cur) => cur.filter((l) => l.productId !== productId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartApi>(
    () => ({ lines, count: lines.reduce((n, l) => n + l.quantity, 0), ready, add, setQuantity, remove, clear }),
    [lines, ready, add, setQuantity, remove, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
