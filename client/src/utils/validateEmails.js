// NOTE: Use https://emailregex.com/ for email validation
// i.e. re variable below.
// v1 is JavaScript re (causes 2x Warnings in console) -
//const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// v2 is HTML5 re (no warnings).
const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default emails => {
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => re.test(email) === false);

  // If invalidEmails congtains some invalid emails:
  if (invalidEmails.length) {
    // NOTE: Remember to use back-ticks (NOT single-quaotes)
    // when using template strings.
    return `These emails are invalid: ${invalidEmails}`;
  }
  // If no invalid emails was found:
  return;
};
