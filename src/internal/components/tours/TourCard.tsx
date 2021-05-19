import {I18nextManager} from 'phovea_core';
import * as React from 'react';

interface ITourCardProps {
    image: string | null;
    title: string;
    text: string;
    href?: string;
    onClickHandler?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
    children?: React.ReactNode;
}

export function TourCard({image, title, text, onClickHandler, href}: ITourCardProps) {
    return (
        <div className="col">
            <div className="card ordino-tour-card shadow-sm">
                {image ?
                  <img className="card-img-top p-2" style={{height: '200px'}} src={image} />
                : null}
                <div className="card-body p-2">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">
                        {text}
                    </p>
                    <a type="button" className="btn btn-light" href={href} onClick={onClickHandler}><i className="mr-1 fas fa-angle-right"></i> {I18nextManager.getInstance().i18n.t('tdp:ordino.startMenu.startTour')}</a>
                </div>
            </div>
        </div>
    );
}
