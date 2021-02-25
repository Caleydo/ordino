import * as React from 'react';
interface ITourCardProps {
    image: string;
    title: string;
    text: string;
    onClickHandler: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
    children?: React.ReactNode;
}
export declare function TourCard({ image, title, text, onClickHandler }: ITourCardProps): JSX.Element;
export {};
