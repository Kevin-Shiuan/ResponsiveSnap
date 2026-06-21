import { useState } from 'react'

import { Button } from '@/components/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/Card'
import { Checkbox } from '@/components/Checkbox'
import { Input } from '@/components/Input'
import { Cross2Icon } from '@radix-ui/react-icons'

import { DeviceSettings } from '../../types'
import DeviceSelect from './DeviceSelect'

const MAX_DIMENSION = 4096
const MIN_DIMENSION = 360

export const minmax = (value: number, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  return Math.max(Math.min(value, max), min)
}

interface DeviceCardProps {
  index: number
  deviceSettings: DeviceSettings
  removable: boolean
  updateDeviceSettings: (deviceSettings: DeviceSettings) => void
  removeDevice: () => void
}

const DeviceCard = ({ index, deviceSettings, removable, updateDeviceSettings, removeDevice }: DeviceCardProps) => {
  const { emulateDevice, width, height } = deviceSettings
  const isCustomSize = emulateDevice === 'custom'
  const [dimension, setDimension] = useState<Record<string, string>>({ width: String(width), height: String(height) })

  const updateDevice = (newDevice: string) => {
    updateDeviceSettings({ ...deviceSettings, emulateDevice: newDevice })
  }

  const changeDimension =
    (property: keyof Pick<DeviceSettings, 'width' | 'height'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setDimension((prev) => ({ ...prev, [property]: e.currentTarget.value }))
    }

  const getUpdateDimension = (property: keyof Pick<DeviceSettings, 'width' | 'height'>) => () => {
    const newValue = parseInt(dimension[property], 10)

    if (isNaN(newValue)) {
      setDimension((prev) => ({ ...prev, [property]: String(deviceSettings[property]) }))
      return
    }

    const clampedDimension = Math.min(MAX_DIMENSION, Math.max(MIN_DIMENSION, newValue))
    setDimension((prev) => ({ ...prev, [property]: String(clampedDimension) }))
    updateDeviceSettings({ ...deviceSettings, [property]: clampedDimension })
  }

  const updateFullPage = () => {
    updateDeviceSettings({ ...deviceSettings, fullPage: !deviceSettings.fullPage })
  }

  return (
    <Card>
      {removable && (
        <CardHeader className="px-3 py-2.5 flex justify-between items-center">
          <CardTitle className="text-xs font-medium text-muted-foreground">{index + 1}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remove device"
            className="w-[28px] h-[28px] hover:bg-destructive hover:text-destructive-foreground transition-colors"
            onClick={removeDevice}
          >
            <Cross2Icon className="w-[14px] h-[14px]" />
          </Button>
        </CardHeader>
      )}
      <CardContent className={`px-3 pb-3 space-y-2 ${removable ? '' : 'pt-3'}`}>
        <DeviceSelect value={emulateDevice} onValueChange={updateDevice} />
        {isCustomSize && (
          <div className="flex gap-x-2">
            <Input
              type="number"
              aria-label="Width in pixels"
              placeholder="Width"
              value={dimension.width}
              onChange={changeDimension('width')}
              onBlur={getUpdateDimension('width')}
            />
            <Input
              type="number"
              aria-label="Height in pixels"
              placeholder="Height"
              value={dimension.height}
              onChange={changeDimension('height')}
              onBlur={getUpdateDimension('height')}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="px-3 pb-3">
        <div className="flex items-center space-x-2">
          <Checkbox id={`fullPage${index}`} checked={deviceSettings.fullPage} onClick={updateFullPage} />
          <label
            htmlFor={`fullPage${index}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full page
          </label>
        </div>
      </CardFooter>
    </Card>
  )
}

export default DeviceCard
