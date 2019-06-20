// SurveyField contaisn logic to render a single
// label and text input.
import React from 'react';

// ({ input }) == (props.input)
export default ({ input, label, meta: { error, touched } }) => {
  // console.log(input);
  // <input {...input}/> == e.g. <input onBlur={input.onBlur} onChange={input.onChange}/>
  // => <input {...input}/> == "Mr Input, please take input object and all its callback funcs
  //console.log(meta); // NOTE: "meta" object contains error-field.
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
  // NOTE: Above: {touched && error} == if meta.touched is true, show meta.error message.
};
