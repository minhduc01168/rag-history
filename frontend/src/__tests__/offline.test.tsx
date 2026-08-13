import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Offline Mode Tests', () => {
  it('renders Đại Việt Kids AI title', () => {
    render(<App />);
    expect(screen.getAllByText(/Đại Việt Kids AI/i).length).toBeGreaterThan(0);
  });

  it('renders mascot Cụ Rùa on home page', () => {
    render(<App />);
    expect(screen.getAllByText(/Cụ Rùa/i).length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Sân Chơi Lịch Sử/i })).toBeInTheDocument();
  });
});
