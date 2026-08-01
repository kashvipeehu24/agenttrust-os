import { useEffect, useState } from "react";
import { getPolicies } from "../services/governanceApi";
import type { Policy } from "../types/policy";

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        setLoading(true);

        const data = await getPolicies();

        setPolicies(data);
      } catch (err) {
        setError("Failed to load governance policies.");

        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPolicies();
  }, []);

  return {
    policies,
    loading,
    error,
  };
}