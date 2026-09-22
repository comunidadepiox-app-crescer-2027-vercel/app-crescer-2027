const URL_ROTA = "https://api.tomtom.com/maps/orbis/routing/routes/calculate";

export async function consultarRota({ origem, destino, apiKey, fetchImpl = fetch }) {
  const res = await fetchImpl(URL_ROTA, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "TomTom-Api-Version": "3",
      "TomTom-Api-Key": apiKey,
      Attributes:
        "routes.summary.travelDurationInSeconds,routes.summary.trafficDelayDurationInSeconds",
    },
    body: JSON.stringify({
      routePlanningLocations: {
        origin: { type: "Point", coordinates: [origem.lng, origem.lat] },
        destination: { type: "Point", coordinates: [destino.lng, destino.lat] },
      },
      traffic: "live",
      travelMode: "car",
      routeType: "fast",
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`TomTom recusou a rota (${res.status}).`);
  return res.json();
}
