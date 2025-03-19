export interface Truck {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'inactive';
  route: {
    id: string;
    name: string;
  };
  lastUpdate: string;
}

export interface User {
  id: string;
  type: 'garbage_man' | 'normal_user';
  name: string;
}