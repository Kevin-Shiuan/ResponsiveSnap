import { DeviceSettings } from '../types/index'

interface Params {
  URL: string
  settings: DeviceSettings
  userId: string | null
}

export async function requestSnap({ params, fetchUrl }: { params: Params; fetchUrl: string }) {
  try {
    return await fetch(fetchUrl + '/snap', {
      method: 'POST',
      body: JSON.stringify({
        URL: params.URL,
        settings: params.settings,
        userId: params.userId
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      cache: 'no-store'
    }).then((res) => res.json())
  } catch (err) {
    console.log(err)
    return err
  }
}
