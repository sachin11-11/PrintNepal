export type Coordinates = {
  lat: number;
  lng: number;
};

const EARTH_RADIUS_KM = 6371;

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineDistanceKm(from: Coordinates, to: Coordinates) {
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function estimateDeliveryMinutes(distanceKm: number) {
  return Math.round(distanceKm * 8 + 20);
}

export function estimateCompletionMinutes(productName: string) {
  const normalized = productName.toLowerCase();

  if (normalized.includes("id card") || normalized.includes("student id")) return 60;
  if (normalized.includes("sticker")) return 120;
  if (normalized.includes("wedding") || normalized.includes("catalog")) return 1440;
  if (normalized.includes("laptop wrapper")) return 180;

  return 120;
}
