import React from 'react';
interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: React.ReactNode;
}
export declare function CommonSessionCard({ cardName, faIcon, cardInfo, children }: ICommonSessionCardProps): JSX.Element;
export {};
