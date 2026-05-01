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
const TARGET_ZONE_COORDINATES: [number, number][] = [
  [76.88993581083604, 43.23841921827178],
  [76.9482711747007, 43.24255679498326],
  [76.94661625173856, 43.255069770640404],
  [76.88818164614032, 43.25078012304439],
];

export function CarMap({ cars, selectedCarId, onMapReady, onSelectCar }: CarMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zonePolygonRef = useRef<SVGPolygonElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const onMapReadyRef = useRef(onMapReady);

  const updateTargetZone = () => {
    const map = mapRef.current;
    const polygon = zonePolygonRef.current;

    if (!map || !polygon) {
      return;
    }

    const points = TARGET_ZONE_COORDINATES.map(([lon, lat]) => {
      const point = map.project([lon, lat]);
      return `${point.x},${point.y}`;
    }).join(' ');

    polygon.setAttribute('points', points);
  };

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: DEFAULT_CENTER,
      zoom: 11,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.on('load', () => {
      updateTargetZone();
      onMapReadyRef.current();
    });
    map.on('move', updateTargetZone);
    map.on('zoom', updateTargetZone);
    map.on('resize', updateTargetZone);

    return () => {
      map.off('move', updateTargetZone);
      map.off('zoom', updateTargetZone);
      map.off('resize', updateTargetZone);
      map.remove();
      if (mapRef.current === map) {
        mapRef.current = null;
      }
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
      element.setAttribute('aria-label', `Открыть карточку ${car.name}`);
      element.addEventListener('click', () => onSelectCar(car));

      return new maplibregl.Marker({ element, anchor: 'center' })
        .setLngLat([car.lon, car.lat])
        .addTo(map);
    });
  }, [cars, onSelectCar, selectedCarId]);

  return (
    <div className="map-shell">
      <div className="map" ref={containerRef} />
      <svg className="target-zone" aria-hidden="true">
        <polygon ref={zonePolygonRef} />
      </svg>
    </div>
  );
}
