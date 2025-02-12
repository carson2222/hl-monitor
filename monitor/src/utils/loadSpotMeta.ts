export async function loadSpotMeta(): Promise<any> {
  try {
    const info = await fetch("https://api.hyperliquid.xyz/info", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "spotMeta",
      }),
      method: "POST",
    });

    if (info.ok) {
      const data = await info.json();
      console.log("Successfully loaded spotMeta");
      return data;
    } else {
      console.error(`Error: ${info.status} ${info.statusText}`);
    }
  } catch (error) {
    console.error(error);
  }
}
