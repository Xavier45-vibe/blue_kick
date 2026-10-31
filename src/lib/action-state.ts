/** Result shape returned by every admin server action (drives toast notifications). */
export interface ActionState {
  ok: boolean;
  message: string;
}

export const idle: ActionState = { ok: true, message: "" };

export function fail(message: string): ActionState {
  return { ok: false, message };
}

export function done(message: string): ActionState {
  return { ok: true, message };
}
