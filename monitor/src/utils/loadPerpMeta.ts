export async function loadPerpMeta(): Promise<any> {
  try {
    const info = await fetch("https://rpc.hyperliquid.xyz/info", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "meta",
      }),
      method: "POST",
    });

    if (info.ok) {
      const data = await info.json();
      console.log("Successfully loaded perpMeta");
      return data;
    } else {
      console.error(`Error: ${info.status} ${info.statusText}`, Date.now());
    }
  } catch (error) {
    console.error(error, Date.now());
  }
}
