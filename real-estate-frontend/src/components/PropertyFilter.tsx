// src/components/PropertyFilter.tsx
import { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { PropertyFilter } from '../types/property';

interface Props {
  onFilterChange: (filter: PropertyFilter) => void;
}

export function PropertyFilterForm({ onFilterChange }: Props) {
  const [filter, setFilter] = useState<PropertyFilter>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
      <TextField
        label="Name"
        value={filter.name || ''}
        onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        sx={{ mr: 2 }}
      />
      <TextField
        label="Address"
        value={filter.address || ''}
        onChange={(e) => setFilter({ ...filter, address: e.target.value })}
        sx={{ mr: 2 }}
      />
      <TextField
        label="Min Price"
        type="number"
        value={filter.priceMin || ''}
        onChange={(e) => setFilter({ ...filter, priceMin: Number(e.target.value) })}
        sx={{ mr: 2 }}
      />
      <TextField
        label="Max Price"
        type="number"
        value={filter.priceMax || ''}
        onChange={(e) => setFilter({ ...filter, priceMax: Number(e.target.value) })}
        sx={{ mr: 2 }}
      />
      <Button type="submit" variant="contained">Search</Button>
    </Box>
  );
}