import React from 'react';
import { Trial } from '../types';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface TrialCardProps {
  trial: Trial;
}

const TrialCard: React.FC<TrialCardProps> = ({ trial }) => {
  return (
    <Card className="my-4 shadow-lg">
      <CardContent>
        <Typography variant="h5" component="div">
          {trial.nct_number}: {trial.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="my-2">
          <strong>Status:</strong> {trial.status}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="my-2">
          <strong>Conditions:</strong> {trial.conditions}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="my-2">
          <strong>Location:</strong> {trial.location}
        </Typography>
        <Button
          component={Link}
          to={`/trial/${trial.idx}`}
          variant="contained"
          color="primary"
          className="mt-4"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrialCard;
