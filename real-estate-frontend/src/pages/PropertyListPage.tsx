import { Container, Grid, Typography, Alert, CircularProgress } from '@mui/material';
import { PropertyFilterForm } from '../components/PropertyFilter';
import { PropertyCard } from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';

export function PropertyListPage() {
  const { properties, loading, error, setFilter } = useProperties({ page: 1, pageSize: 20 });
  console.log(properties);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Real Estate Properties</Typography>
      <PropertyFilterForm onFilterChange={setFilter} />
      
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {properties.map(property => (
            <Grid size={{ xs: 12, sm: 6, md:4 }} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}