import { useEffect, useState } from 'react'

import { PlusIcon } from '@radix-ui/react-icons'

import MESSAGE_TYPE from '../constant/messageType'
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
  const [devices, setDevices] = useState([DEFAULT_DEVICES_VALUE])
  const showAddButton = devices.length < MAXIMUM_DEVICES_COUNT

  const onSubmit = () => {
    sendMessage(MESSAGE_TYPE.TAKE_SCREENSHOT, { url, devices })
    console.log('submit')
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

  // useEffect(() => {
  //   const handleMessage = async (event: MessageEvent) => {
  //     const { type, token } = event.data.pluginMessage

  //     switch (type) {
  //       case PLUGIN_GET_TOKEN_SUCCESS: {
  //         const isValid = await checkTokenValidity(token.idToken)
  //         if (!isValid) {
  //           const newToken = await refreshToken(token.refreshToken)
  //           if (!newToken) {
  //             setToken(null)
  //             sendMessage(UI_TOKEN_INVALID)
  //             return
  //           }
  //           setToken(newToken)
  //           sendMessage(UI_UPDATE_TOKEN, newToken)
  //         }
  //         break
  //       }

  //       case PLUGIN_LOGIN_SUCCESS:
  //         setToken(token)
  //         break

  //       case PLUGIN_LOGOUT_SUCCESS:
  //         setToken(null)
  //         break

  //       default:
  //         break
  //     }
  //   }

  //   sendMessage(UI_GET_TOKEN)

  //   window.addEventListener('message', handleMessage)

  //   return () => {
  //     window.removeEventListener('message', handleMessage)
  //   }
  // }, [])

  return (
    <div className="m-0 p-4 pt-6 w-full h-full min-h-dvh overflow-auto flex flex-col gap-y-[24px]">
      <div className="flex flex-col gap-y-6">
        <div className="space-y-3">
          <div className="space-y-0.5">
            <h2 className="text-xl font-semibold tracking-tight">Website URL</h2>
          </div>
          <Input type="text" value={url} placeholder="URL" onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Devices</h2>
          {devices.map((device, index) => (
            <DeviceCard
              key={index}
              index={index}
              deviceSettings={device}
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
      <Button type="submit" onClick={onSubmit}>
        Take Screenshot{devices.length > 1 ? 's' : ''}
      </Button>
    </div>
  )
}

export default App
