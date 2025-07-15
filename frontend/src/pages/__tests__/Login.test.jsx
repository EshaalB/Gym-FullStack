/* global describe, it, expect, beforeEach, jest, global */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Mock Redux store
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { success: jest.fn(), error: jest.fn() },
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock sweetAlert
jest.mock('../../utils/sweetAlert', () => ({
  showErrorAlert: jest.fn(),
  showConfirmAlert: jest.fn(() => Promise.resolve({ isConfirmed: false })),
}));

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Remove localStorage for each test
    window.localStorage.clear();
  });

  function renderLogin() {
    return render(
      <Provider store={{ getState: () => ({}), subscribe: () => {}, dispatch: mockDispatch }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
  }

  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows validation error for invalid email', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/email is invalid/i)).toBeInTheDocument();
  });

  it('shows validation error for short password', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('shows API error message on failed login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' }),
      })
    );
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
}); 