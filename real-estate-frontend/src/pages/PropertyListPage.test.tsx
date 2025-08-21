import { render, screen } from '@testing-library/react';
import { PropertyListPage } from './PropertyListPage';
import { useProperties } from '../hooks/useProperties';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Property, PropertyFilter } from '../types/property';

// Mock the useProperties hook
jest.mock('../hooks/useProperties', () => ({
  useProperties: jest.fn()
}));

describe('PropertyListPage', () => {
  const mockUseProperties = useProperties as jest.MockedFunction<typeof useProperties>;

  beforeEach(() => {
    // Reset mock before each test
    (useProperties as jest.Mock).mockReset();
  });

  test('displays loading state', () => {
    mockUseProperties.mockReturnValue({
      properties: [] as Property[],
      total: 0,
      loading: true,
      error: null,
      setFilter: jest.fn() as React.Dispatch<React.SetStateAction<PropertyFilter>>
    });

    render(
      <BrowserRouter>
        <PropertyListPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when there is an error', () => {
    const errorMessage = 'Failed to load properties';
    mockUseProperties.mockReturnValue({
      properties: [] as Property[],
      total: 0,
      loading: false,
      error: errorMessage,
      setFilter: jest.fn() as React.Dispatch<React.SetStateAction<PropertyFilter>>
    });

    render(
      <BrowserRouter>
        <PropertyListPage />
      </BrowserRouter>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('displays property list when data is loaded', () => {
    const mockProperties: Property[] = [
      {
        id: '1',
        name: 'Test Property',
        address: '123 Test St',
        price: 100000,
        codeInternal: 'TEST1',
        year: 2020,
        owner: {
          id: '1',
          name: 'John Doe',
          address: '456 Owner St',
          photo: 'test.jpg'
        },
        images: [],
        traces: []
      }
    ];

    mockUseProperties.mockReturnValue({
      properties: mockProperties,
      total: mockProperties.length,
      loading: false,
      error: null,
      setFilter: jest.fn() as React.Dispatch<React.SetStateAction<PropertyFilter>>
    });

    render(
      <BrowserRouter>
        <PropertyListPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Real Estate Properties')).toBeInTheDocument();
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });
});