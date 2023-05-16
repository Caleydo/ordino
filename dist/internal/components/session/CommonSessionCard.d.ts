import { IProvenanceGraphDataDescription } from 'tdp_core';
import React, { AnimationEventHandler } from 'react';
interface ICommonSessionCardProps {
    cardName: string;
    faIcon: string;
    cardInfo?: string;
    children?: (sessionAction: SessionActionChooser) => React.ReactNode;
    /**
     * If set to `true` the card is rendered with a halo animation
     */
    highlight?: boolean;
    /**
     * Callback when the highlight animation starts
     * @see https://reactjs.org/docs/events.html#animation-events
     */
    onHighlightAnimationStart?: AnimationEventHandler<any>;
    /**
     * Callback when the highlight animation ends
     * @see https://reactjs.org/docs/events.html#animation-events
     */
    onHighlightAnimationEnd?: AnimationEventHandler<any>;
}
/**
 * Types of actions exposed by the CommonSessionCard component
 */
export declare const enum EAction {
    SELECT = "select",
    SAVE = "save",
    EDIT = "edit",
    CLONE = "clone",
    EXPORT = "export",
    DELETE = "delete"
}
export type SessionActionChooser = (type: EAction, event: React.MouseEvent<HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;
export type SessionAction = (event: React.MouseEvent<HTMLElement>, desc: IProvenanceGraphDataDescription, updateSessions?: any) => boolean | Promise<boolean>;
/**
 * Wrapper component that exposes actions to be used in children components.
 */
export declare function CommonSessionCard({ cardName, faIcon, cardInfo, children, highlight, onHighlightAnimationStart, onHighlightAnimationEnd, }: ICommonSessionCardProps): React.JSX.Element;
export {};
//# sourceMappingURL=CommonSessionCard.d.ts.map