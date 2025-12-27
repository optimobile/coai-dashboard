import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NavigationSearch } from '../NavigationSearch';
import { BrowserRouter } from 'react-router-dom';

describe('NavigationSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search button', () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('opens search modal when button is clicked', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('filters search results based on query', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'EU AI Act' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/EU AI Act Compliance/)).toBeInTheDocument();
    });
  });

  it('shows compliance results when searching for compliance', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'compliance' } });
    });

    await waitFor(() => {
      expect(screen.getByText('Compliance')).toBeInTheDocument();
    });
  });

  it('shows training results when searching for courses', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'courses' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/Browse Courses/)).toBeInTheDocument();
    });
  });

  it('displays no results message when search has no matches', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    });

    await waitFor(() => {
      expect(screen.getByText(/No results found/)).toBeInTheDocument();
    });
  });

  it('clears search when X button is clicked', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'test' } });
    });

    const clearButton = screen.getByRole('button', { name: '' });
    if (clearButton && clearButton.querySelector('svg')) {
      fireEvent.click(clearButton);
      
      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
        expect(searchInput.value).toBe('');
      });
    }
  });

  it('supports keyboard navigation', async () => {
    render(
      <BrowserRouter>
        <NavigationSearch />
      </BrowserRouter>
    );

    const searchButton = screen.getByRole('button', { name: /search navigation/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search features, pages/) as HTMLInputElement;
      fireEvent.change(searchInput, { target: { value: 'compliance' } });
    });

    const searchInput = screen.getByPlaceholderText(/Search features, pages/);
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    // Modal should close after Escape
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Search features, pages/)).not.toBeInTheDocument();
    });
  });
});
