const isType = (T, v) =>
  v instanceof T ||
  (T.name && Object.prototype.toString.apply(v) === `[object ${T.name}]`);

const implementor = {
  required(checker, flow) {
    Object.defineProperty(checker, "required", {
      get() {
        flow.validators.push(
          data => data !== undefined && data !== null && data !== ""
        );
        return checker;
      }
    });
  },
  or(checker, flow) {
    checker.or = orValue => {
      flow.mappers.push(data =>
        data !== undefined && data !== null && data !== "" ? data : orValue
      );
      return checker;
    };
  },
  of(checker, flow) {
    checker.of = ofType => {
      flow.validators.push(data => isType(ofType, data));
      return checker;
    };
  },
  in(checker, flow) {
    checker.in = list => {
      flow.validators.push(data => list.includes(data));
      return checker;
    };
  },
  minLength(checker, flow) {
    checker.minLength = length => {
      flow.validators.push(data => data.length >= length);
      return checker;
    };
  },
  maxLength(checker, flow) {
    checker.maxLength = length => {
      flow.validators.push(data => data.length <= length);
      return checker;
    };
  },
  min(checker, flow) {
    checker.min = minValue => {
      flow.validators.push(data => data >= minValue);
      return checker;
    };
  },
  max(checker, flow) {
    checker.max = maxValue => {
      flow.validators.push(data => data <= maxValue);
      return checker;
    };
  },
  props(checker, flow) {
    checker.props = propsList => {
      flow.validators.push(data => {
        const keys = Object.keys(data);

        return propsList.reduce(
          (before, key) => before && keys.includes(key),
          true
        );
      });
      return checker;
    };
  },
  prop(checker, flow) {
    checker.prop = propName => {
      flow.validators.push(data => Object.keys(data).includes(propName));
      return checker;
    };
  }
};

const createChecker = (mainCheck, propsList) => {
  const flow = {
    validators: [mainCheck],
    mappers: []
  };
  const checker = {
    validate(value) {
      const mappedValue = flow.mappers.reduce(
        (val, mapper) => mapper(val),
        value
      );

      return {
        value: mappedValue,
        isValid: flow.validators.reduce(
          (current, validator) => current && validator(mappedValue),
          true
        )
      };
    },
    is(value) {
      return checker.validate(value).isValid;
    }
  };

  propsList.forEach(prop => {
    if (prop in implementor) {
      implementor[prop](checker, flow);
    }
  });

  return checker;
};

const facade = {
  get bool() {
    return createChecker(data => isType(Boolean, data), ["required", "or"]);
  },
  get string() {
    return createChecker(data => isType(String, data), [
      "required",
      "or",
      "in",
      "minLength",
      "maxLength"
    ]);
  },
  get number() {
    return createChecker(data => isType(Number, data), [
      "required",
      "or",
      "in",
      "min",
      "max"
    ]);
  },
  get array() {
    return createChecker(data => isType(Array, data), [
      "required",
      "or",
      "of",
      "minLength",
      "maxLength"
    ]);
  },
  get object() {
    return createChecker(data => isType(Object, data), [
      "required",
      "or",
      "prop",
      "props"
    ]);
  }
};

export default facade;
