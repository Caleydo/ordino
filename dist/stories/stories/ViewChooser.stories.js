import React from 'react';
import { ViewChooser, EViewChooserMode, EExpandMode } from 'ordino';
const views = [...Array(5).keys()].map((a, i) => ({
    index: i,
    id: 'view_1',
    name: 'Dummy ' + i,
    selection: 'multiple',
    group: {
        name: 'General ' + i,
        order: 10 + i
    }
}));
console.log(views);
export default {
    title: 'tdp/ViewChooser',
    component: ViewChooser,
};
// tslint:disable-next-line: variable-name
const Template = (args) => React.createElement(ViewChooser, Object.assign({}, args));
// tslint:disable-next-line: variable-name
export const Embedded = Template.bind({});
Embedded.args = {
    views,
};
// tslint:disable-next-line: variable-name
export const OverlayRight = Template.bind({});
OverlayRight.args = {
    views,
    mode: EViewChooserMode.OVERLAY
};
// tslint:disable-next-line: variable-name
export const OverlayLeft = Template.bind({});
OverlayLeft.args = {
    views,
    mode: EViewChooserMode.OVERLAY,
    expand: EExpandMode.LEFT
};
//# sourceMappingURL=ViewChooser.stories.js.map