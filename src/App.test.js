import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page', () => {
  render(<App />);
  const loginHeading = screen.getByRole('heading', { name: /login/i });
  const submitButton = screen.getByRole('button', { name: /aanmelden/i });

  expect(loginHeading).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});
