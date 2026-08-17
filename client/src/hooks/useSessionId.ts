import { useState } from "react";

let _sessionId: string | null = null;

function getOrCreateSessionId(): string {
  if (_sessionId) return _sessionId;

  const stored = sessionStorage.getItem("trai_session_id");
  if (stored) {
    _sessionId = stored;
    return stored;
  }

  const newId = crypto.randomUUID();
  sessionStorage.setItem("trai_session_id", newId);
  _sessionId = newId;
  return newId;
}

export function useSessionId(): string {
  const [sessionId] = useState(() => getOrCreateSessionId());
  return sessionId;
}

export { getOrCreateSessionId };
