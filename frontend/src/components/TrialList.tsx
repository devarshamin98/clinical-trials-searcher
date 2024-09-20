import React from 'react';
import { Trial } from '../types';
import TrialCard from './TrialCard';

interface TrialListProps {
  trials: Trial[];
}

const TrialList: React.FC<TrialListProps> = ({ trials }) => {
  return (
    <div>
      {trials.map((trial) => (
        <TrialCard key={trial.idx} trial={trial} />
      ))}
    </div>
  );
};

export default TrialList;
