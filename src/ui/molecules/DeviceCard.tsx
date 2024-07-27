import { useState } from 'react'

import { Button } from '@/components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card'
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

  return (
    <Card className="group">
      <CardHeader className="pb-3 flex justify-between items-center">
        <CardTitle className="">Device {index + 1}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className={`w-[28px] h-[28px] opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all ${removable ? 'visible' : 'invisible'}`}
          onClick={removeDevice}
        >
          <Cross2Icon className="w-[14px] h-[14px]" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <DeviceSelect value={emulateDevice} onValueChange={updateDevice} />
        {isCustomSize && (
          <div className="flex gap-x-[8px]">
            <Input
              type="number"
              placeholder="Width"
              value={dimension.width}
              onInput={changeDimension('width')}
              onBlur={getUpdateDimension('width')}
            />
            <Input
              type="number"
              placeholder="Height"
              value={dimension.height}
              onInput={changeDimension('height')}
              onBlur={getUpdateDimension('height')}
            />
          </div>
        )}
      </CardContent>
      {/* TODO: fullPage screenshot */}
      {/* <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fullPage"
            // checked={false}
            // onClick={() => {
            //   console.log('clicked')
            // }}
          />
          <label
            htmlFor="fullPage"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full Page
          </label>
        </div>
      </CardFooter> */}
    </Card>
  )
}

export default DeviceCard
