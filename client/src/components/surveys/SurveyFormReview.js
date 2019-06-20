// SurveyFormReviews shows users their form inputs for review.
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import { withRouter } from 'react-router-dom';
// See: https://reacttraining.com/react-router/web/api/withRouter
// for more about withRouter
// We are using withRouter's 'history' object
// (passed as a props on Line-15, and used on Line-37)
// to teach SurveyFormReview about
// routing history and how to get re-direct user to Dashboard.
import * as actions from '../../actions';

const SurveyFormReview = ({ onCancel, formValues, submitSurvey, history }) => {
  const reviewFields = _.map(formFields, ({ name, label }) => {
    return (
      <div key={name}>
        <label style={{ marginBottom: '5px' }}>{label}</label>
        <div style={{ marginBottom: '20px' }}>{formValues[name]}</div>
      </div>
    );
  });
  // NOTE: Above: ({ name, label }) == field.name, field.label

  return (
    <div>
      <h5>Please confirm your entries</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={() => submitSurvey(formValues, history)}
        className="green btn-flat white-text right"
      >
        Send Survey
        <i className="material-icons right">email</i>
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  //console.log(state);
  return { formValues: state.form.SurveyForm.values };
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview));
