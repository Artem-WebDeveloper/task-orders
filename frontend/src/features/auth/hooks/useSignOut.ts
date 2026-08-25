import { useCallback } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../model/context";

export function useSignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return useCallback(async () => {
    await signOut();
    navigate("/login", { replace: true });
  }, [signOut, navigate]);
}
