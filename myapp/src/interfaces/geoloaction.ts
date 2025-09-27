export interface GeocodingResponse {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
export interface Coordinates {
  lat: number;
  lon: number;
}