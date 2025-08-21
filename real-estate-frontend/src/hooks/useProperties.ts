import { useState, useEffect } from 'react';
import { Property, PropertyFilter } from '../types/property';
import { propertyApi } from '../api/propertyApi';

export function useProperties(initialFilter: PropertyFilter) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.searchProperties(filter);
        setProperties(data.items);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filter]);

  return { properties, total, loading, error, setFilter };
}