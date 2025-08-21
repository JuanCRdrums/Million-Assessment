import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { Property } from '../types/property';
import { Link } from 'react-router-dom';

interface Props {
  property: Property;
}

export function PropertyCard({ property }: Props) {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      {property.images[0] && (
        <CardMedia
          component="img"
          height="140"
          image={property.images[0].file}
          alt={property.name}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {property.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {property.address}
        </Typography>
        <Typography variant="h6" color="primary">
          ${property.price.toLocaleString()}
        </Typography>
        <Button 
          component={Link} 
          to={`/property/${property.id}`}
          variant="contained" 
          sx={{ mt: 2 }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}