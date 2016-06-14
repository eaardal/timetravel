const createValidator = (...validators) => values => validators.reduce((prev, curr) => {
  if (typeof prev === 'function') {
    return { ...prev(values), ...curr(values) };
  }
  return { ...prev, ...curr(values) };
});
export default createValidator;
