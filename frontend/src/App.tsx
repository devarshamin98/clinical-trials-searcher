import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import SearchForm from './components/SearchForm';
import TrialList from './components/TrialList';
import TrialDetails from './components/TrialDetails';
import axios from 'axios';
import { Trial } from './types';

const App: React.FC = () => {
  const [trials, setTrials] = useState<Trial[]>([]);

  const handleSearch = async (disease: string, therapy: string) => {
    try {
      const response = await axios.post('http://localhost:8000/api/search', { disease, therapy });
      setTrials(response.data);
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Use element prop instead of putting JSX inside Route */}
        <Route path="/" element={
          <>
            <h1>Clinical Trials Search</h1>
            <SearchForm onSearch={handleSearch} />
            <TrialList trials={trials} />
          </>
        } />
        <Route path="/trial/:idx" element={<TrialDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
