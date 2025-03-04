export async function loadCoinMids(): Promise<any> {
  try {
    const info = await fetch("https://api.hyperliquid.xyz/info", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "allMids",
      }),
      method: "POST",
    });

    if (info.ok) {
      const data = await info.json();
      console.log("Successfully loaded allMids");
      return data;
    } else {
      console.error(`Error: ${info.status} ${info.statusText}`, Date.now());
    }
  } catch (error) {
    console.error(error, Date.now());
  }
}
