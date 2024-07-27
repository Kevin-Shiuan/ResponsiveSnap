import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select'

import { DEVICES } from '../../constants/devices'

interface DeviceSelectProps {
  value?: string
  onValueChange: (value: string) => void
}

const DeviceSelect = ({ value, onValueChange }: DeviceSelectProps) => {
  return (
    <Select onValueChange={onValueChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a device" />
      </SelectTrigger>
      <SelectContent>
        {DEVICES.map((device) => (
          <SelectItem key={device} value={device}>
            {device}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default DeviceSelect
