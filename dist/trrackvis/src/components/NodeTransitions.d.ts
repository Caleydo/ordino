export default function nodeTransitions(xOffset: number, yOffset: number, clusterOffset: number, backboneOffset: number, duration: number, annotationOpen: number, annotationHeight: number): {
    enter: (data: any) => {
        x: number[];
        y: number[];
        opactiy: number;
        timing: {
            duration: number;
        };
    };
    leave: (data: any) => {
        x: number;
        y: number;
        opacity: number;
    };
    update: (data: any) => {
        x: number[];
        y: number[];
        opactiy: number;
        timing: {
            duration: number;
        };
    };
    start: (data: any) => {
        x: number;
        y: number;
        opacity: number;
    };
};
