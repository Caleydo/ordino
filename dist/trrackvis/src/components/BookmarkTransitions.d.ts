export default function BookmarkTransitions(xOffset: number, yOffset: number, nodeList: any[]): {
    enter: (data: any) => {
        x: number[];
        y: number[];
        opactiy: number;
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
    };
    start: (data: any) => {
        x: number;
        y: number;
        opacity: number;
    };
};
