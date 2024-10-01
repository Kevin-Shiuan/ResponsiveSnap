import { DeviceSettings } from '../types/index'

interface RequestScreenshotDataProps {
  fetchUrl: string
  url: string
  settings: DeviceSettings
  userId: string
}

export async function requestScreenshotData({ fetchUrl, url, settings, userId }: RequestScreenshotDataProps) {
  try {
    const response = await fetch(fetchUrl + '/v2/screenshot', {
      method: 'POST',
      body: JSON.stringify({
        url,
        settings,
        userId
      }),
      headers: {
        'Content-type': 'application/json'
      },
      cache: 'no-store'
    })
    return await response.json()
  } catch (err) {
    console.log(err)
    return err
  }
}
