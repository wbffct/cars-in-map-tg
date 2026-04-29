import type { Car, RawCar } from '../types';

const DEEPLINK_BASE_URL = 'https://app.delitime.kz/auto';
const CARS_REFRESH_INTERVAL_MS = 120_000;

export const CARS_URL = import.meta.env.VITE_CARS_URL ?? `${import.meta.env.BASE_URL}cars.json`;
export const CARS_REFRESH_INTERVAL = CARS_REFRESH_INTERVAL_MS;

export const buildDeeplink = (licensePlateNumber: string): string => {
  return `${DEEPLINK_BASE_URL}/${licensePlateNumber.toUpperCase()}`;
};

export const mapRawCar = (car: RawCar): Car => {
  const plate = car.license_plate_number.toUpperCase();

  return {
    carId: car.car_id,
    lat: car.latitude,
    lon: car.longitude,
    hex: car.hex,
    plate,
    deeplinkUrl: buildDeeplink(plate),
  };
};

export const loadCars = async (): Promise<Car[]> => {
  const response = await fetch(`${CARS_URL}?t=${Date.now()}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load cars: ${response.status}`);
  }

  const rawCars = (await response.json()) as RawCar[];

  return rawCars.map(mapRawCar);
};
