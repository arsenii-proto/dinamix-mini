import NestedModel from "../NestedModel";

const validator = (data, blueprint) => {
  let isValid = true;
  let value = data;

  Object.keys(blueprint).forEach(prop => {
    if (!isValid) return;

    let propChecker = blueprint[prop];
    let propValue = value[prop];

    if (propChecker instanceof NestedModel) {
      propChecker = propChecker.schema.blueprint;
    }

    if (Object.prototype.toString.call(propChecker) === "[Object Object]") {
      const validatorResult = validator(propValue, propChecker);
      if (!validatorResult.isValid) {
        return (isValid = false);
      }

      value[prop] = validatorResult.value;
    }

    if (propChecker.validate instanceof Function) {
      const validatorResult = propChecker.validate(propValue);
      if (!validatorResult.isValid) {
        return (isValid = false);
      }

      value[prop] = validatorResult.value;
    }
  });

  return { isValid, value };
};

export default validator;
