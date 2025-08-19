import { useEffect, useState } from 'react'

import { PlusIcon } from '@radix-ui/react-icons'

import MESSAGE_TYPE from '../constants/messageType'
import { DeviceSettings } from '../types'
import './App.css'
import { Button } from './components/Button'
import { Input } from './components/Input'
import DeviceCard from './molecules/DeviceCard'
import { sendMessage } from './services/messageService'

const DEFAULT_DEVICES_VALUE = {
  width: 1920,
  height: 1080,
  emulateDevice: 'custom',
  fullPage: false
}

const MAXIMUM_DEVICES_COUNT = 3

const App = () => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [devices, setDevices] = useState([DEFAULT_DEVICES_VALUE])
  const showAddButton = devices.length < MAXIMUM_DEVICES_COUNT

  const onSubmit = () => {
    sendMessage(MESSAGE_TYPE.TAKE_SCREENSHOT, { url, devices })
  }

  const addNewDevice = () => {
    setDevices((prev) => {
      if (prev.length >= MAXIMUM_DEVICES_COUNT) {
        return prev
      }
      return [...prev, DEFAULT_DEVICES_VALUE]
    })
  }

  const updateDeviceSettingsAt = (index: number) => (newDeviceSettings: DeviceSettings) => {
    setDevices((prev) => {
      const newDevices = [...prev]
      newDevices[index] = newDeviceSettings
      return newDevices
    })
  }

  const removeDeviceAt = (index: number) => () => {
    setDevices((prev) => {
      if (prev.length === 1) {
        return prev
      }
      const newDevices = [...prev]
      newDevices.splice(index, 1)
      return newDevices
    })
  }

  const checkURL = () => {
    try {
      if (!url) {
        setError('Please enter a URL')
        return
      }
      new URL(url)
    } catch (e) {
      setError('The URL is invalid')
      return
    }
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

  return (
    <div className="relative m-0 w-full h-full min-h-dvh max-h-dvh overflow-hidden">
      <div className="space-y-5 px-4 pt-6 pb-16 h-full overflow-auto">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Website URL</h2>
          <div className="space-y-1">
            <Input
              type="text"
              value={url}
              placeholder="URL"
              onInput={(e) => setUrl(e.currentTarget.value)}
              onChange={() => setError('')}
              onBlur={checkURL}
              error={Boolean(error)}
            />
            {error && <p className="pl-2.5 text-xs font-medium text-destructive">{error}</p>}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Devices</h2>
          {devices.map((device, index) => (
            <DeviceCard
              key={index}
              index={index}
              deviceSettings={device}
              removable={devices.length > 1}
              updateDeviceSettings={updateDeviceSettingsAt(index)}
              removeDevice={removeDeviceAt(index)}
            />
          ))}
          {showAddButton && (
            <Button variant="secondary" className="w-full space-x-2" onClick={addNewDevice}>
              <PlusIcon />
              <span>Add Device</span>
            </Button>
          )}
        </div>
      </div>
      <Button type="submit" onClick={onSubmit} disabled={Boolean(error)} className="absolute inset-x-4 bottom-4">
        Take Screenshot{devices.length > 1 ? 's' : ''}
      </Button>
    </div>
  )
}

export default App
