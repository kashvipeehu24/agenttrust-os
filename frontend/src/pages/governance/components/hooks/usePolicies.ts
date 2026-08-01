import { useEffect, useState } from "react";
import { getPolicies } from "../services/governanceApi";
import type { Policy } from "../types/policy";

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    getPolicies().then(setPolicies);
  }, []);

  return { policies };
}