import { useEffect, useRef } from 'react';
import maplibregl, { type Map } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Car } from '../types';

type CarMapProps = {
  cars: Car[];
  selectedCarId: number | null;
  onMapReady: () => void;
  onSelectCar: (car: Car) => void;
};

const DEFAULT_CENTER: [number, number] = [76.886, 43.238];

export function CarMap({ cars, selectedCarId, onMapReady, onSelectCar }: CarMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const onMapReadyRef = useRef(onMapReady);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: DEFAULT_CENTER,
      zoom: 11,
      attributionControl: false,
    });

    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    mapRef.current.on('load', () => onMapReadyRef.current());

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = cars.map((car) => {
      const element = document.createElement('button');
      element.className = 'map-pin';
      if (car.carId === selectedCarId) {
        element.classList.add('map-pin--active');
      }
      element.type = 'button';
      element.textContent = car.plate.slice(0, 1);
      element.setAttribute('aria-label', `Открыть карточку ${car.plate}`);
      element.addEventListener('click', () => onSelectCar(car));

      return new maplibregl.Marker({ element, anchor: 'bottom' })
        .setLngLat([car.lon, car.lat])
        .addTo(map);
    });
  }, [cars, onSelectCar, selectedCarId]);

  return <div className="map" ref={containerRef} />;
}
