export interface TurnActions {
  work?: {
    jobId: string;
    hours: number;
  };
  study?: {
    course: string;
    hours: number;
  };
  travel?: {
    cityId: string;
  };
  housing?: {
    tier: number;
    cityId?: string;
  };
  errands?: {
    shoppings?: {
      itemId: string;
      qty: number;
    }[];
    leisureHours?: number;
  };
}

export interface RoomState {
  code: string;
  phase: 'lobby' | 'planning' | 'resolving' | 'results' | 'finished';
  turnIndex: number;
  players: {
    id: string;
    name: string;
    ready: boolean;
  }[];
}

export interface TurnResults {
  turnIndex: number;
  results: PlayerResult[];
  cityEvents: CityEvent[];
}

export interface PlayerResult {
  playerId: string;
  deltas: {
    money?: number;
    energy?: number;
    health?: number;
    happiness?: number;
    education?: number;
  };
  events: string[];
}

export interface CityEvent {
  cityId: string;
  event: string;
}

export interface MapState {
  cities: City[];
  routes: Route[];
  markets: { [cityId: string]: Market };
}

export interface City {
  id: string;
  name: string;
  pos: [number, number];
  traits: {
    rent: number;
    jobs: string[];
    school: number;
    crime: number;
  };
  markets: {
    wageMul: number;
    pricesMul: number;
    rentMul: number;
  };
}

export interface Route {
  a: string;
  b: string;
  km: number;
  tolls: number;
  risk: number;
}

export interface Market {
  wageMul: number;
  pricesMul: number;
  rentMul: number;
}

// Add more as needed
