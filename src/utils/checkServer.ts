export async function checkServer({ fetchUrl }: { fetchUrl: string}) {
    console.log('checking server status...');
  try {
    const serverState = await fetch(fetchUrl+'/server-status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      cache: 'no-store',
    }).then((res) => res.json());
    console.log(serverState.msg);
  } catch (err) {
    console.log(err);
    figma.notify(`Plugin's server is down, please try again later`);
    return err;
  }
}
