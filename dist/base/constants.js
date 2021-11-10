export const views = [...Array(6).keys()].map((a, i) => ({
    index: i,
    id: 'view_' + i,
    name: 'Dummy ' + i,
    selection: 'multiple',
    group: {
        name: 'General ' + i,
        order: 10 + i
    }
}));
//# sourceMappingURL=constants.js.map