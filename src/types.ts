export type RawCar = {
  car_id: number;
  latitude: number;
  longitude: number;
  hex: string;
  license_plate_number: string;
};

export type Car = {
  carId: number;
  lat: number;
  lon: number;
  hex: string;
  plate: string;
  deeplinkUrl: string;
};
