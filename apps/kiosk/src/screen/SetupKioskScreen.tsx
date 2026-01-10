const SetupKioskScreen = ({ deviceId }: { deviceId: string }) => {
    return (
        <div className="absolute flex h-full w-full justify-center flex-col items-center">
            
            <p className="text-7xl font-extrabold ">This kiosk is currently not ready for use. <br /><br /> Please use a another order point.</p>
            <div id="setupId" className="rounded-[14px] bg-black p-2 mt-4 w-max absolute bottom-6 align-center">
                <div className="text-white text-2sm font-bold mb-1">Kiosk Device ID:</div>
                <div className="bg-white p-4 font-mono rounded-[8px]">
                   {deviceId}
                </div>
            </div>
            
        </div>
    );
};

export default SetupKioskScreen;