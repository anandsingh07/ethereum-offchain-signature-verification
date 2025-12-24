import { BACKEND_URL } from '../config/env';

export async function executeViaRelayer(payload) {
  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}
