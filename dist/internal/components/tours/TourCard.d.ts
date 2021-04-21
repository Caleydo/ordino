import * as React from 'react';
interface ITourCardProps {
    image: string;
    title: string;
    text: string;
    href?: string;
    onClickHandler?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
    children?: React.ReactNode;
}
export declare function TourCard({ image, title, text, onClickHandler, href }: ITourCardProps): JSX.Element;
export {};
