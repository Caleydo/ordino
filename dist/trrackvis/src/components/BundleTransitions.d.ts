import { BundleMap } from '../Utils/BundleMap';
export default function bundleTransitions(xOffset: number, yOffset: number, clusterOffset: number, backboneOffset: number, duration: number, expandedClusterList: string[], stratifiedMap: any, nodeList: any[], annotationOpen: number, annotationHeight: number, bundleMap?: BundleMap): {
    enter: (data: any) => {
        x: number[];
        y: number[];
        opacity: number[];
        timing: {
            duration: number;
        };
        validity: boolean;
        height: number;
    };
    leave: () => {
        x: number;
        y: number;
        opacity: number;
    };
    update: (data: any) => {
        x: number[];
        y: number[];
        opacity: number[];
        timing: {
            duration: number;
        };
        validity: boolean;
        height: number[];
    };
    start: () => {
        x: number;
        y: number;
        opacity: number;
    };
};
