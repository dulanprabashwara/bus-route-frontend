import { Stop, Route, RouteDetail, RouteStop, DeparturesResponse, JourneySearchResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export async function searchStops(query: string): Promise<Stop[]> {
  if (!query || query.trim().length === 0) return [];
  const res = await fetch(`${API_BASE}/stops/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search stops');
  return res.json();
}

export async function getStopById(id: number): Promise<Stop> {
  const res = await fetch(`${API_BASE}/stops/${id}`);
  if (!res.ok) throw new Error('Failed to fetch stop');
  return res.json();
}

export async function getRoutes(routeNumber?: string, serviceType?: string): Promise<Route[]> {
  const params = new URLSearchParams();
  if (routeNumber) params.append('routeNumber', routeNumber);
  if (serviceType) params.append('serviceType', serviceType);
  
  const res = await fetch(`${API_BASE}/routes?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch routes');
  return res.json();
}

export async function getRouteById(id: number): Promise<RouteDetail> {
  const res = await fetch(`${API_BASE}/routes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch route detail');
  return res.json();
}

export async function getDepartures(stopId: number, date?: string, time?: string): Promise<DeparturesResponse> {
  const params = new URLSearchParams();
  params.append('stopId', stopId.toString());
  if (date) params.append('date', date);
  if (time) params.append('time', time);

  const res = await fetch(`${API_BASE}/departures?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch departures');
  return res.json();
}

export async function searchJourneys(
  fromStopId: number,
  toStopId: number,
  date?: string,
  time?: string
): Promise<JourneySearchResponse> {
  const params = new URLSearchParams();
  params.append('fromStopId', fromStopId.toString());
  params.append('toStopId', toStopId.toString());
  if (date) params.append('date', date);
  if (time) params.append('time', time);

  const res = await fetch(`${API_BASE}/journeys/search?${params.toString()}`);
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(errorBody || 'Failed to search journeys');
  }
  return res.json();
}
