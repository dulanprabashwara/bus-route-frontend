export interface Stop {
  id: number;
  name: string;
  nameEn?: string;
  nameSi?: string;
  nameTa?: string;
  normalizedName: string;
  district?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
}

export interface Route {
  id: number;
  routeNumber: string;
  name: string;
  originStop?: Stop;
  destinationStop?: Stop;
  serviceType: string;
  province?: string;
  interProvincial?: boolean;
}

export interface RouteStop {
  stopSequence: number;
  fareStage?: number;
  distanceFromOriginKm?: number;
  pickupAllowed: boolean;
  dropoffAllowed: boolean;
  stop: Stop;
}

export interface RouteDetail {
  route: Route;
  stops: RouteStop[];
  totalStops: number;
  availableServiceTypes: string[];
}

export interface Departure {
  routeId: number;
  routeNumber: string;
  routeName: string;
  serviceType: string;
  boardingStop: Stop;
  destination: string;
  scheduledDeparture: string;
  tripHeadsign?: string;
  tripId: number;
}

export interface DeparturesResponse {
  stop: Stop;
  requestedDate: string;
  requestedTime: string;
  departures: Departure[];
  totalCount: number;
}

export interface JourneyLeg {
  legIndex: number;
  routeId: number;
  routeNumber: string;
  routeName: string;
  serviceType: string;
  tripId: number;
  boardingStop: Stop;
  dropOffStop: Stop;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  fare?: number;
  fareType?: 'EXACT_POINT_TO_POINT' | 'FULL_ENDPOINT_ONLY' | 'FARE_UNAVAILABLE';
  fareStatus?: 'EXACT' | 'ENDPOINT_ONLY' | 'UNAVAILABLE';
}

export interface Journey {
  journeyId: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  transferCount: number;
  totalFare?: number;
  fareStatus: 'COMPLETE' | 'PARTIAL' | 'UNAVAILABLE';
  labels: string[];
  legs: JourneyLeg[];
}

export interface JourneySearchResponse {
  fromStop: Stop;
  toStop: Stop;
  requestedDate: string;
  requestedTime: string;
  journeys: Journey[];
  totalResults: number;
  dataNote: string;
}
