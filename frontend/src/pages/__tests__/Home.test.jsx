/* global describe, it */
import React from 'react';
import { render } from '@testing-library/react';
import Home from '../Home';
describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
  });
}); 