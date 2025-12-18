import { useEffect, useState } from "react";

// Persist logs in memory for the duration of the app session
const sessionLogs: string[] = [];

const LogOutput = () => {
  const [logs, setLogs] = useState<string[]>(sessionLogs);

  useEffect(() => {
    const handleLog = (message: string) => {
      sessionLogs.push(message);
      setLogs([...sessionLogs]);
    };

    (window as any).log.onLog(handleLog);

    return () => {
      // Cleanup: remove the listener when component unmounts
      (window as any).log.offLog?.(handleLog);
    };
  }, []);

  return (
    <div className="p-2 bg-black text-white text-sm font-mono w-full h-full overflow-y-scroll scroll-auto rounded-sm">
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
};

export default LogOutput;
