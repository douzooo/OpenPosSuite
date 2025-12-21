import { useEffect, useState } from 'react'

declare global {
  interface Window {
    ipcRenderer: import('electron').IpcRenderer
  }
}

export const useSCUConnection = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    window.ipcRenderer.on('scu-connected', (_event, connected: boolean) => {
      console.log('SCU connection status:', connected)
      setIsConnected(connected)
    })

    window.ipcRenderer.on('scu-message', (_event, data: string) => {
      console.log('SCU message received:', data)
    })

    window.ipcRenderer.send('check-scu-connection')

    return () => {
      window.ipcRenderer.off('scu-connected', () => {})
      window.ipcRenderer.off('scu-message', () => {})
    }
  }, [])

  const sendToSCU = (data: any) => {
    window.ipcRenderer.send('send-to-scu', data)
  }

  return { isConnected, sendToSCU }
}
