import { useEffect, useRef, useState } from 'react'

import { PlusIcon } from '@radix-ui/react-icons'

import MESSAGE_TYPE from '../constants/messageType'
import { DeviceSettings } from '../types'
import './App.css'
import { Button } from './components/Button'
import { Input } from './components/Input'
import DeviceCard from './molecules/DeviceCard'
import { sendMessage } from './services/messageService'

const DEFAULT_DEVICES_VALUE: DeviceSettings = {
  width: 1920,
  height: 1080,
  emulateDevice: 'custom',
  fullPage: false
}

const MAXIMUM_DEVICES_COUNT = 3

interface DeviceEntry {
  id: number
  settings: DeviceSettings
}

const validateUrl = (value: string): string => {
  if (!value) return 'Enter a URL'
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return 'URL must start with https://'
  }
  try {
    new URL(value)
    return ''
  } catch {
    return 'Invalid URL'
  }
}

const App = () => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const nextId = useRef(0)
  const touchedRef = useRef(false)
  const [devices, setDevices] = useState<DeviceEntry[]>(() => [
    { id: nextId.current++, settings: DEFAULT_DEVICES_VALUE }
  ])
  const showAddButton = devices.length < MAXIMUM_DEVICES_COUNT
  const count = devices.length

  const onSubmit = () => {
    const urlError = validateUrl(url)
    if (urlError) {
      setError(urlError)
      return
    }
    sendMessage(MESSAGE_TYPE.TAKE_SCREENSHOT, { url, devices: devices.map((d) => d.settings) })
    setLoading(true)
  }

  const addNewDevice = () => {
    setDevices((prev) => {
      if (prev.length >= MAXIMUM_DEVICES_COUNT) return prev
      return [...prev, { id: nextId.current++, settings: DEFAULT_DEVICES_VALUE }]
    })
  }

  const updateDeviceSettingsAt = (index: number) => (newDeviceSettings: DeviceSettings) => {
    setDevices((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], settings: newDeviceSettings }
      return next
    })
  }

  const removeDeviceAt = (index: number) => () => {
    setDevices((prev) => {
      if (prev.length === 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      if (prefersDarkScheme.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    prefersDarkScheme.addEventListener('change', applyTheme)
    applyTheme()
    return () => {
      prefersDarkScheme.removeEventListener('change', applyTheme)
    }
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage
      if (msg?.type === MESSAGE_TYPE.SCREENSHOT_COMPLETE) {
        setLoading(false)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <div className="flex flex-col w-full h-full min-h-dvh max-h-dvh">
      <div className="flex-1 space-y-5 px-4 pt-6 overflow-auto">
        <div className="space-y-1.5">
          <label htmlFor="url-input" className="text-sm font-medium">
            URL
          </label>
          <Input
            id="url-input"
            type="text"
            value={url}
            placeholder="https://example.com"
            onChange={(e) => {
              const val = e.currentTarget.value
              setUrl(val)
              touchedRef.current = true
              if (error) {
                if (!val || !validateUrl(val)) setError('')
              }
            }}
            onBlur={() => {
              if (touchedRef.current) setError(validateUrl(url))
            }}
            error={Boolean(error)}
          />
          {error && <p className="pl-2.5 text-xs font-medium text-destructive">{error}</p>}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Devices</h2>
          {devices.map((device, index) => (
            <DeviceCard
              key={device.id}
              index={index}
              deviceSettings={device.settings}
              removable={count > 1}
              updateDeviceSettings={updateDeviceSettingsAt(index)}
              removeDevice={removeDeviceAt(index)}
            />
          ))}
          {showAddButton && (
            <Button variant="secondary" className="w-full space-x-2" onClick={addNewDevice}>
              <PlusIcon />
              <span>Add device</span>
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 py-4 shrink-0">
        <Button type="submit" onClick={onSubmit} disabled={Boolean(error) || loading} className="w-full">
          {loading
            ? `Taking screenshot${count > 1 ? 's' : ''}…`
            : `Take screenshot${count > 1 ? 's' : ''}`}
        </Button>
      </div>
    </div>
  )
}

export default App
