import '../src/scss/storybook.scss';
import { initializeLibrary } from 'tdp_core';
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize();
// TODO: This is async, how to wait for it?
initializeLibrary();

export const decorators = [mswDecorator]

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
