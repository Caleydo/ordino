import { I18nextManager } from 'visyn_core';
import * as React from 'react';

interface ITourCardProps {
  id: string;
  image: string | null;
  title: string;
  text: string;
  href?: string;
  onClickHandler?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function TourCard({ id, image, title, text, onClickHandler, href }: ITourCardProps) {
  return (
    <div className="col position-relative" data-testid="tour-card">
      <div className="card ordino-tour-card shadow-sm" data-id={id} data-testid={id}>
        {image ? <img className="card-img-top p-2" style={{ height: '200px' }} src={image} alt="Tour Image" /> : null}
        <div className="card-body p-2">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{text}</p>
          <a
            className="btn btn-light"
            title={I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour')}
            href={href}
            onClick={onClickHandler}
            data-testid="start-tour-button"
          >
            <i className="me-1 fas fa-angle-right" /> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour')}
          </a>
        </div>
      </div>
    </div>
  );
}
