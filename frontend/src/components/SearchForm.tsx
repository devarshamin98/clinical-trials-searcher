import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface SearchFormProps {
  onSearch: (disease: string, drug: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [disease, setDisease] = useState('');
  const [drug, setDrug] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(disease, drug);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto my-8">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Disease"
            variant="outlined"
            fullWidth
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Drug"
            variant="outlined"
            fullWidth
            value={drug}
            onChange={(e) => setDrug(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} className="text-center">
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SearchForm;
