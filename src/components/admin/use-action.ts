"use client";

import { useActionState, useEffect, useRef } from "react";
import { idle, type ActionState } from "@/lib/action-state";
import { useToast } from "./toast";

/** `useActionState` that raises a toast whenever the server action reports a result. */
export function useToastAction(action: (prev: ActionState, formData: FormData) => Promise<ActionState>) {
  const { notify } = useToast();
  const [state, formAction, pending] = useActionState(action, idle);
  const last = useRef(state);

  useEffect(() => {
    if (state !== last.current && state.message) notify(state.ok ? "success" : "error", state.message);
    last.current = state;
  }, [state, notify]);

  return { state, formAction, pending };
}
