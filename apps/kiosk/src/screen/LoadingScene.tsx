import { ipcRenderer } from "electron";
import { electron } from "node:process";
import { useEffect, useState } from "react";
import LogOutput from "../components/Log";
import { useBuildInfo } from "../hooks/useBuildInfo";

const LoadingScene = () => {
  
  const {buildInfo, error} = useBuildInfo();
  

  return (
    <div className="p-4 absolute w-full h-full text-2xl flex border border-gray-200 flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2>OpenPOS Kiosk</h2>
        <p className="text-sm">{buildInfo?.buildDate}-{buildInfo?.buildType}-{buildInfo?.version}</p>
      </div>
      <LogOutput />
    </div>
  );
};

export default LoadingScene;
