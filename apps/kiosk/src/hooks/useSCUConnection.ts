import { useEffect, useState } from 'react'

declare global {
  interface Window {
    ipcRenderer: {
      on: (channel: string, listener: (event: any, ...args: any[]) => void) => void
      off: (channel: string, listener: (event: any, ...args: any[]) => void) => void
      send: (channel: string, ...args: any[]) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
  }
}

export const useSCUConnection = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Listen for SCU connection status updates from main process
    window.ipcRenderer.on('scu-connected', (_event, connected: boolean) => {
      console.log('SCU connection status:', connected)
      setIsConnected(connected)
    })

    // Listen for SCU messages
    window.ipcRenderer.on('scu-message', (_event, data: string) => {
      console.log('SCU message received:', data)
    })

    // Check initial connection status
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
