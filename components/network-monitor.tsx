"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function NetworkMonitor() {
  const [isOnline, setIsOnline] = useState(true)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowAlert(true)
      const timer = setTimeout(() => setShowAlert(false), 3000)
      return () => clearTimeout(timer)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowAlert(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showAlert) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant={isOnline ? "default" : "destructive"} className="flex items-center">
        {isOnline ? <Wifi className="h-4 w-4 mr-2" /> : <WifiOff className="h-4 w-4 mr-2" />}
        <div>
          <AlertTitle>{isOnline ? "Back Online" : "Offline"}</AlertTitle>
          <AlertDescription>
            {isOnline
              ? "Your connection has been restored. Changes will now sync."
              : "You are currently offline. Changes will be saved locally and synced when you reconnect."}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  )
}
