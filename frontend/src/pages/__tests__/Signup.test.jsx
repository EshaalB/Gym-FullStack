/* global describe, it */
import React from 'react';
import { render } from '@testing-library/react';
import Signup from '../Signup';
describe('Signup Page', () => {
  it('renders without crashing', () => {
    render(<Signup />);
  });
}); 