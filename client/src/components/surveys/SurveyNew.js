// SurveyNew shows SurveyForm and SurveyFormReview.
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
  // Old school basic way to set state via constructor:
  //constructor(props) {
  //  super(props);
  //  this.state = { new: true };
  //}
  // Alternative (100% equal) way to set a state for component:
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }
    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }
  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: 'surveyForm',
  destroyOnUnmount: true
})(SurveyNew);
