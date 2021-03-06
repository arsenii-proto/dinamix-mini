import validator from "./DataValidator";

const ModelFactoryHandler = hooks => ({
  apply() {
    throw new Error("Model Factory need can be used just like constructor");
  },
  construct(Model, props) {
    const model = new Model();
    const modelProxy = new Proxy(model, ModelHandler(hooks));

    model.originals = {};
    model.attributes = props.length ? props[0] : {};

    if (hooks.construct.length) {
      hooks.construct.forEach(hook => hook.apply(modelProxy, [props, model]));
    }

    if (hooks.validating.length) {
      hooks.validating.forEach(hook => hook.apply(modelProxy, [model]));
    }

    let valid = validator(modelProxy.json, hooks.getters.blueprint);

    if (hooks.validator.length) {
      valid = hooks.validator.reduce(
        (all, hook) => all && hook.apply(modelProxy, [model]),
        true
      );
    }

    if (hooks.validated.length) {
      hooks.validated.forEach(hook => hook.apply(modelProxy, [valid, model]));
    }

    return modelProxy;
  },
  defineProperty(Model, key, descriptor) {
    if (!Reflect.isExtensible(Model)) return false;

    if (key in hooks.staticSetters) {
      return hooks.staticSetters[key](descriptor.value);
    }

    if (key in hooks.staticGetters) return false;

    if (key in hooks.staticProps) {
      const prop = hooks.staticProps[key];

      if (prop.configurable) {
        hooks.staticProps[key] = descriptor;
        return true;
      }

      return false;
    }

    hooks.staticProps[key] = descriptor;

    return true;
  },
  deleteProperty(Model, key) {
    if (key in hooks.staticProps) {
      const prop = hooks.staticProps[key];

      if (prop.configurable) {
        delete hooks.staticProps[key];
        return true;
      }
    }
    return false;
  },
  get(Model, key) {
    if (key in hooks.staticGetters) {
      return hooks.staticGetters[key];
    }

    if (key in hooks.staticProps) {
      return hooks.staticProps[key];
    }

    return undefined;
  },
  getOwnPropertyDescriptor(Model, key) {
    if (key in hooks.staticGetters) {
      return {
        configurable: true,
        enumerable: true,
        value: hooks.staticGetters[key]
      };
    }

    if (key in hooks.staticProps) {
      return { ...hooks.staticProps[key] };
    }

    return { configurable: true, enumerable: true, value: undefined };
  },
  getPrototypeOf(Model) {
    return Model;
  },
  has(Model, key) {
    return key in hooks.staticGetters || key in hooks.staticProps;
  },
  isExtensible(Model) {
    return Reflect.isExtensible(Model);
  },
  ownKeys() {
    return [
      ...Object.keys(hooks.staticProps),
      ...Object.keys(hooks.staticGetters)
    ];
  },
  preventExtensions(Model) {
    Object.preventExtensions(Model);
    return true;
  },
  set(Model, key, value) {
    if (!Reflect.isExtensible(Model)) return value;

    if (key in hooks.staticSetters) {
      return hooks.staticSetters[key](value);
    }

    if (key in hooks.staticGetters) return false;

    if (key in hooks.staticProps) {
      const prop = hooks.staticProps[key];

      if (prop.configurable) {
        return (hooks.staticProps[key].value = value);
      }
    }

    return value;
  },
  setPrototypeOf() {
    return false;
  }
});

const ModelHandler = hooks => ({
  defineProperty(Model, key, descriptor) {
    if (!Reflect.isExtensible(Model)) return false;

    if (key in hooks.setters) {
      return hooks.setters[key](descriptor.value);
    }

    if (key in hooks.getters) return false;

    if (key in hooks.props) {
      const prop = hooks.props[key];

      if (prop.configurable) {
        hooks.props[key] = descriptor;
        return true;
      }

      return false;
    }

    hooks.props[key] = descriptor;

    return true;
  },
  deleteProperty(Model, key) {
    if (key in hooks.props) {
      const prop = hooks.props[key];

      if (prop.configurable) {
        delete hooks.props[key];
        return true;
      }
    }
    return false;
  },
  get(Model, key) {
    if (key in hooks.getters) {
      return hooks.getters[key];
    }

    if (key in hooks.props) {
      return hooks.props[key];
    }

    return undefined;
  },
  getOwnPropertyDescriptor(Model, key) {
    if (key in hooks.getters) {
      return {
        configurable: true,
        enumerable: true,
        value: hooks.getters[key]
      };
    }

    if (key in hooks.props) {
      return { ...hooks.props[key] };
    }

    return { configurable: true, enumerable: true, value: undefined };
  },
  getPrototypeOf(Model) {
    return Model;
  },
  has(Model, key) {
    return key in hooks.getters || key in hooks.props;
  },
  isExtensible(Model) {
    return Reflect.isExtensible(Model);
  },
  ownKeys() {
    return [...Object.keys(hooks.props), ...Object.keys(hooks.getters)];
  },
  preventExtensions(Model) {
    Object.preventExtensions(Model);
    return true;
  },
  set(Model, key, value) {
    if (!Reflect.isExtensible(Model)) return value;

    if (key in hooks.setters) {
      return hooks.setters[key](value);
    }

    if (key in hooks.getters) return false;

    if (key in hooks.props) {
      const prop = hooks.props[key];

      if (prop.configurable) {
        return (hooks.props[key].value = value);
      }
    }

    return value;
  }
});

export default ModelFactoryHandler;
