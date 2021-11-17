import * as React from 'react';
interface ITourCardProps {
    id: string;
    image: string | null;
    title: string;
    text: string;
    href?: string;
    onClickHandler?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
    children?: React.ReactNode;
}
export declare function TourCard({ id, image, title, text, onClickHandler, href }: ITourCardProps): JSX.Element;
export {};