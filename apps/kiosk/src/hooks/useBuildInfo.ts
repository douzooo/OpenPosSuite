import { useEffect, useState } from "react";

interface BuildInfo {
  version: string;
  buildDate: string;
  buildType: "dev" | "prod";
}

export function useBuildInfo() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/build-info.json")
      .then((res) => res.json())
      .then((data) => setBuildInfo(data))
      .catch((err) => setError(err.message));
  }, []);

  return { buildInfo, error };
}
