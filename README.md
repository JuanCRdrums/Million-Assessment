# Real Estate Management System

A full-stack application for managing real estate properties, built with .NET 9 and React, following clean architecture principles.

## Table of Contents
- [Project Structure](#project-structure)
- [Backend Project](#backend-project)
- [Frontend Project](#frontend-project)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Technical Details](#technical-details)

## Project Structure

```
Million Assessment/
├── RealEstate/              # Backend API project (.NET 9)
├── RealEstate.Tests/        # Backend unit tests
└── real-estate-frontend/    # Frontend application (React)
```

## Backend Project

### Technology Stack
- .NET 9
- MongoDB.Driver (4.x)
- AutoMapper
- FluentValidation
- xUnit (for testing)

### Database Architecture
- **Database Engine**: MongoDB
- **Connection Strategy**: 
  - MongoDB.Driver with dependency injection
  - Repository pattern implementation
  - Asynchronous operations
  - Data seeding on startup

### Hexagonal Architecture
The backend follows a Hexagonal (Ports and Adapters) Architecture:

```
RealEstate/
├── Application/        # Application services, DTOs
├── Domain/            # Domain entities, interfaces
├── Infrastructure/    # Data access, external services

```

### API Endpoints

#### Properties
- `GET /api/properties` - List properties with filtering
- `GET /api/properties/{id}` - Get property details


## Frontend Project

### Technology Stack
- React 19
- TypeScript 4.9
- Material-UI v7
- React Router v7
- Axios
- Jest & React Testing Library

### Project Structure
```
real-estate-frontend/
├── src/
│   ├── api/          # API services
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Route components
│   ├── types/        # TypeScript definitions
│   └── utils/        # Helper functions
└── tests/           # Test files
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- .NET 9 SDK
- MongoDB (running instance)
- Visual Studio 2022 or VS Code

### MongoDB Setup
1. Install MongoDB Community Server
2. Start MongoDB service:
```bash
net start MongoDB
```
3. Verify MongoDB is running on default port (27017)

### Backend Setup
1. Clone the repository
2. Update MongoDB connection in `appsettings.json`:
```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstate"
  }
}
```
3. Run the API:
```bash
cd RealEstate
dotnet run
```

The API will:
- Create database if not exists
- Run data seeder with test data
- Start at `https://localhost:44365`

### Frontend Setup
1. Install dependencies:
```bash
cd real-estate-frontend
npm install
```
2. Start development server:
```bash
npm start
```
Access the application at `http://localhost:3000`

## Running Tests

### Backend Tests
Run from solution root:
```bash
dotnet test
```

### Frontend Tests
Run all tests:
```bash
cd real-estate-frontend
npm test
```

Run specific tests:
```bash
npm test PropertyListPage
npm test PropertyDetailPage
```

## Technical Details

### Backend Features
- CQRS pattern with MediatR
- Repository pattern for MongoDB
- Custom exception middleware
- Swagger documentation
- FluentValidation
- Dependency injection
- Automatic data seeding

### Frontend Features
- Clean architecture
- Custom data fetching hooks
- TypeScript type safety
- Material-UI components
- Jest unit testing
- CORS handling
- Responsive design

### API Documentation
Access Swagger UI at:
```
https://localhost:44365/swagger
```

### Environment Configuration
Frontend environment variables (`.env`):
```
REACT_APP_API_URL=https://localhost:44365/api
```

### Error Handling
- Global exception handling (Backend)
- Error boundaries (Frontend)
- Proper HTTP status codes
- Consistent error messages

### Performance
- MongoDB indexing
- API response caching
- Frontend bundle optimization
- Lazy loading routes

## License
[MIT License](LICENSE)