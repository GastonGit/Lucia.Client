import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../components/Gallery';

test('renders boiled rice text', () => {
    render(<App />);
    const boilElement = screen.getByText(/Boiled rice/i);
    expect(boilElement).toBeInTheDocument();
});
