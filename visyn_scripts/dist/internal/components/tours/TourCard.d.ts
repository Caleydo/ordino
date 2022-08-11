import * as React from 'react';
interface ITourCardProps {
    id: string;
    image: string | null;
    title: string;
    text: string;
    href?: string;
    onClickHandler?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
}
export declare function TourCard({ id, image, title, text, onClickHandler, href }: ITourCardProps): JSX.Element;
export {};
//# sourceMappingURL=TourCard.d.ts.map