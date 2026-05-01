import type { Car } from '../types';

type CarCardProps = {
  car: Car | null;
  onOpenDeeplink: (url: string) => void;
  onClose: () => void;
};

export function CarCard({ car, onOpenDeeplink, onClose }: CarCardProps) {
  if (!car) {
    return null;
  }

  return (
    <section className="car-card">
      <div className="car-card__header">
        <button className="car-card__close" type="button" onClick={onClose} aria-label="Закрыть карточку">
          ×
        </button>
      </div>
      <h2>{car.name}</h2>
      <p className="car-card__plate">{car.plate}</p>
      <button className="car-card__cta" type="button" onClick={() => onOpenDeeplink(car.deeplinkUrl)}>
        Открыть в приложении
      </button>
    </section>
  );
}
