import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button, 
  CircularProgress, 
  ImageList, 
  ImageListItem,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Property } from '../types/property';
import { propertyApi } from '../api/propertyApi';

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await propertyApi.getPropertyById(id);
        setProperty(data);
        setError(null);
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Property not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
      >
        Back to List
      </Button>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{xs: 12}}>

            <Typography variant="h4" gutterBottom>
              {property.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {property.address}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${property.price.toLocaleString()}
            </Typography>
          </Grid>

          {property.images.length > 0 && (
            <Grid size={{xs: 12}}>
              <ImageList sx={{ maxHeight: 400 }} cols={3} rowHeight={200}>
                {property.images.filter(img => img.enabled).map((image, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={image.file}
                      alt={`Property ${index + 1}`}
                      loading="lazy"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" gutterBottom>Property Details</Typography>
            <Box sx={{ mb: 2 }}>
              <Typography><strong>Internal Code:</strong> {property.codeInternal}</Typography>
              <Typography><strong>Year Built:</strong> {property.year}</Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6" gutterBottom>Owner Information</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {property.owner.photo && (
                <Box
                  component="img"
                  src={property.owner.photo}
                  alt={property.owner.name}
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    mr: 2,
                    objectFit: 'cover'
                  }}
                />
              )}
              <Box>
                <Typography><strong>Name:</strong> {property.owner.name}</Typography>
                <Typography><strong>Address:</strong> {property.owner.address}</Typography>
                {property.owner.birthday && (
                  <Typography>
                    <strong>Birthday:</strong> {new Date(property.owner.birthday).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {property.traces.length > 0 && (
            <Grid size={{xs: 12}}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Property History</Typography>
              <Box sx={{ mt: 2 }}>
                {property.traces.map((trace, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1">{trace.name}</Typography>
                    <Typography color="text.secondary">
                      Date: {new Date(trace.dateSale).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip 
                        label={`Value: $${trace.value.toLocaleString()}`} 
                        color="primary" 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={`Tax: $${trace.tax.toLocaleString()}`} 
                        color="secondary" 
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}