import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders Đại Việt Kids AI title', () => {
    render(<App />);
    const titleElements = screen.getAllByText(/Đại Việt Kids AI/i);
    expect(titleElements.length).toBeGreaterThan(0);
  });

  it('renders Dashboard heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /Đại Việt Kids AI/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Sân Chơi Lịch Sử/i })).toBeInTheDocument();
  });
});
