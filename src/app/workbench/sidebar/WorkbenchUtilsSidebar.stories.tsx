import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { WorkbenchUtilsSidebar } from './WorkbenchUtilsSidebar';
import { EWorkbenchDirection } from '../../../store/interfaces';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WorkbenchUtilsSidebar',
  component: WorkbenchUtilsSidebar,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof WorkbenchUtilsSidebar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
// eslint-disable-next-line react/function-component-definition
const Template: ComponentStory<typeof WorkbenchUtilsSidebar> = (args) => {
  return <WorkbenchUtilsSidebar {...args} />;
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Mapping = Template.bind({}) as typeof Template;
Mapping.args = {
  openTab: null,
  workbench: {
    itemIDType: 'test',
    detailsSidebarOpen: true,
    createNextWorkbenchSidebarOpen: false,
    selectedMappings: [{ entityId: 'test', columnSelection: 'test' }],
    views: [
      {
        name: 'test',
        id: 'test',
        parameters: { prevSelection: [], selectedMappings: {} },
        uniqueId: (Math.random() + 1).toString(36).substring(7),
        filters: [],
      },
    ],
    viewDirection: EWorkbenchDirection.VERTICAL,
    columnDescs: [],
    data: {},
    entityId: 'test',
    name: 'test',
    index: 1,
    selection: [],
  },
};
