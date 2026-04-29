import { useEffect, useState } from 'react';
import { CarCard } from './components/CarCard';
import { CarMap } from './components/CarMap';
import { CARS_REFRESH_INTERVAL, loadCars } from './lib/cars';
import { openTelegramLink } from './lib/telegram';
import { useTelegramMiniApp } from './hooks/useTelegramMiniApp';
import { logEvent } from './lib/logger';
import type { Car } from './types';

export function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const { isTelegram, platform, version, startParam } = useTelegramMiniApp();

  const selectedCar = cars.find((car) => car.carId === selectedCarId) ?? null;

  useEffect(() => {
    logEvent('mini_app_open', {
      isTelegram,
      platform,
      version,
      startParam,
      carsCount: cars.length,
    });
  }, [isTelegram, platform, startParam, version]);

  useEffect(() => {
    let isMounted = true;

    const refreshCars = async () => {
      try {
        const nextCars = await loadCars();

        if (!isMounted) {
          return;
        }

        setCars(nextCars);
        setSelectedCarId((currentCarId) => {
          if (currentCarId === null || nextCars.some((car) => car.carId === currentCarId)) {
            return currentCarId;
          }

          return null;
        });
      } catch (error) {
        logEvent('cars_load_error', {
          message: error instanceof Error ? error.message : String(error),
        });
      }
    };

    void refreshCars();

    const intervalId = window.setInterval(() => {
      void refreshCars();
    }, CARS_REFRESH_INTERVAL);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <main className="app-shell">
      <section className="map-screen">
        <CarMap
          cars={cars}
          selectedCarId={selectedCarId}
          onMapReady={() => logEvent('map_ready', { carsCount: cars.length })}
          onSelectCar={(car) => {
            setSelectedCarId(car.carId);
            logEvent('pin_click', { carId: car.carId, plate: car.plate });
          }}
        />
        {selectedCar ? (
          <button
            className="map-screen__scrim"
            type="button"
            aria-label="Закрыть карточку"
            onClick={() => {
              logEvent('card_close', { carId: selectedCar.carId, plate: selectedCar.plate, source: 'scrim' });
              setSelectedCarId(null);
            }}
          />
        ) : null}
        <div className="map-screen__overlay">
          <CarCard
            car={selectedCar}
            onClose={() => {
              if (!selectedCar) {
                return;
              }

              logEvent('card_close', { carId: selectedCar.carId, plate: selectedCar.plate });
              setSelectedCarId(null);
            }}
            onOpenDeeplink={(url) => {
              if (selectedCar) {
                logEvent('deeplink_click', {
                  carId: selectedCar.carId,
                  plate: selectedCar.plate,
                  deeplinkUrl: url,
                });
              }

              openTelegramLink(url);
            }}
          />
        </div>
      </section>
    </main>
  );
}
