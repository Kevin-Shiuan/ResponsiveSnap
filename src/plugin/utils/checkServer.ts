export async function checkServer({ fetchUrl }: { fetchUrl: string }) {
  console.log('checking server status...');
  try {
    const response = await fetch(fetchUrl + '/server-status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Server is down`);
    }
    const data = await response.json();
    console.log(data.msg);
  } catch (err) {
    console.log(err);
    figma.notify(`Plugin's server is down, please try again later`);
    return err;
  }
}
