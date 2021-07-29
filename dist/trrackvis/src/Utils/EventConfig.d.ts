import { ReactChild } from 'react';
export declare type Config = {
    regularGlyph: ReactChild;
    currentGlyph: ReactChild;
    backboneGlyph: ReactChild;
    bundleGlyph: ReactChild;
};
export declare type EventConfig<E extends string> = {
    [key: string]: Partial<Config>;
};
