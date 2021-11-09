import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {ViewChooser, EViewChooserMode, EExpandMode} from 'ordino';

const views = [...Array(10).keys()].map((a, i) => (
    {
        index: i, // dummy index
        id: 'view_1',
        name: 'Dummy' + i,
        selection: 'multiple',
        group: {
            name: 'General' + i,
            order: 10 + i
        }
    }));

console.log(views)
export default {
    title: 'tdp/ViewChooser',
    component: ViewChooser,
} as ComponentMeta<typeof ViewChooser>;

// tslint:disable-next-line: variable-name
const Template: ComponentStory<typeof ViewChooser> = (args) => <ViewChooser {...args} />;

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
