import { render, screen } from '@testing-library/react';
import { PropertyDetailPage } from './PropertyDetailPage';
import { propertyApi } from '../api/propertyApi';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Property } from '../types/property';

// Mock the router hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn()
}));

// Mock the API
jest.mock('../api/propertyApi');

describe('PropertyDetailPage', () => {
  const mockProperty: Property = {
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
    images: [
      { file: 'test-image.jpg', enabled: true }
    ],
    traces: [
      {
        dateSale: '2023-01-01',
        name: 'Previous Sale',
        value: 95000,
        tax: 2000
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    (propertyApi.getPropertyById as jest.Mock).mockImplementation(() => 
      new Promise(() => {})
    );

    render(
      <BrowserRouter>
        <PropertyDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when API call fails', async () => {
    (propertyApi.getPropertyById as jest.Mock).mockRejectedValue(
      new Error('Failed to load property details')
    );

    render(
      <BrowserRouter>
        <PropertyDetailPage />
      </BrowserRouter>
    );

    const errorMessage = await screen.findByText('Failed to load property details');
    expect(errorMessage).toBeInTheDocument();
  });

  test('displays property not found when no property returned', async () => {
    (propertyApi.getPropertyById as jest.Mock).mockResolvedValue(null);

    render(
      <BrowserRouter>
        <PropertyDetailPage />
      </BrowserRouter>
    );

    const message = await screen.findByText('Property not found');
    expect(message).toBeInTheDocument();
  });

  test('displays property details when data is loaded', async () => {
    (propertyApi.getPropertyById as jest.Mock).mockResolvedValue(mockProperty);

    render(
      <BrowserRouter>
        <PropertyDetailPage />
      </BrowserRouter>
    );

    // Wait for and verify main property details
    expect(await screen.findByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('$100.000')).toBeInTheDocument();

    // Verify owner information
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('456 Owner St')).toBeInTheDocument();

    // Verify property details
    expect(screen.getByText(/TEST1/)).toBeInTheDocument();
    expect(screen.getByText(/2020/)).toBeInTheDocument();

    // Verify property history
    expect(screen.getByText('Previous Sale')).toBeInTheDocument();
    expect(screen.getByText(/\$95.000/)).toBeInTheDocument();
  });

  test('back button is present', async () => {
    (propertyApi.getPropertyById as jest.Mock).mockResolvedValue(mockProperty);

    render(
      <BrowserRouter>
        <PropertyDetailPage />
      </BrowserRouter>
    );

    const backButton = await screen.findByText('Back to List');
    expect(backButton).toBeInTheDocument();
  });
});