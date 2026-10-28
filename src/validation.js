const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(values, signup = false) {
  const errors = {};
  if (signup && !values.name?.trim()) errors.name = 'Please enter your name.';
  if (!values.email?.trim()) errors.email = 'Please enter your email.';
  else if (!emailPattern.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!values.password) errors.password = 'Please enter your password.';
  else if (values.password.length < 6) errors.password = 'Use at least 6 characters.';
  return errors;
}
module.exports = { validate };
