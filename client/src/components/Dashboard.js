import React from 'react';
import { Link } from 'react-router-dom';
import SurveyList from './surveys/SurveyList';

const Dashboard = () => {
  return (
    <div>
      <SurveyList />
      <div className="fixed-action-btn">
        <Link to="/surveys/new" className="btn-floating btn-large red">
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div> // == return (<div>Dshboard</div>);
  );
};
// NOTE: Check Materialize Button from: https://materializecss.com/floating-action-button.html
// NOTE: Check Materialize Icons (used in buttons) from: https://materializecss.com/icons.html

export default Dashboard;
