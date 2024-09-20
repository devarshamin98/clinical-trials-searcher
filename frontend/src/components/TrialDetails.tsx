
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TrialDetails: React.FC = () => {
  const { idx } = useParams<{ idx: string }>();
  const [trialData, setTrialData] = useState<any>(null);

  useEffect(() => {
    const fetchTrialDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/trial/${idx}`);
        setTrialData(response.data);
      } catch (error) {
        console.error('Error fetching trial details:', error);
      }
    };

    fetchTrialDetails();
  }, [idx]);

  if (!trialData) {
    return <div>Loading...</div>;
  }

  // Extract important fields from trialData for table display
  const trial = trialData.protocolSection;

  return (
    <div className="trial-details">
      <h1>{trial.identificationModule?.officialTitle || 'Clinical Trial Details'}</h1>
      <table>
        <tbody>
          <tr>
            <td><strong>Trial ID:</strong></td>
            <td>{trial.identificationModule?.nctId}</td>
          </tr>
          <tr>
            <td><strong>Brief Summary:</strong></td>
            <td>{trial.descriptionModule?.briefSummary}</td>
          </tr>
          <tr>
            <td><strong>Study Type:</strong></td>
            <td>{trial.designModule?.studyType}</td>
          </tr>
          <tr>
            <td><strong>Phase:</strong></td>
            <td>{trial.phases || 'N/A'}</td>
          </tr>
          <tr>
            <td><strong>Conditions:</strong></td>
            <td>{trial.conditionsModule?.conditions?.join(', ')}</td>
          </tr>
          <tr>
            <td><strong>Intervention Model:</strong></td>
            <td>{trial.interventionModule?.interventionModel}</td>
          </tr>
          <tr>
            <td><strong>Primary Outcome:</strong></td>
            <td>{trial.outcomeModule?.primaryOutcomes?.map(outcome => outcome.measure).join(', ')}</td>
          </tr>
          <tr>
            <td><strong>Eligibility Criteria:</strong></td>
            <td>{trial.eligibilityModule?.eligibilityCriteria}</td>
          </tr>
          <tr>
            <td><strong>Status:</strong></td>
            <td>{trial.statusModule?.status}</td>
          </tr>
          <tr>
            <td><strong>Start Date:</strong></td>
            <td>{trial.studyStartDate || 'N/A'}</td>
          </tr>
          <tr>
            <td><strong>Primary Completion Date:</strong></td>
            <td>{trial.primaryCompletionDate || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TrialDetails;
