const objectly = obj => (typeof obj === "object" ? obj : {});
const keys = obj => Object.keys(objectly(obj));

function parseMixinActions({ actions }, { staticGetters }) {
  keys(actions).forEach(key => {
    if (key in staticGetters) return;
    if (typeof actions[key] !== "function") return;

    const action = actions[key];

    staticGetters[key] = (...args) => {
      const started = new Date();
      return Promise.resolve()
        .then(() => action(...args))
        .catch(err => {
          console.error(`Action ${key} get crash`, [err]);
        })
        .then(result => ({
          result,
          dates: {
            started,
            ended: new Date()
          }
        }));
    };
  });
}

function parseMixinMethods({ methods }, { getters }) {
  keys(methods).forEach(key => {
    if (key in getters) return;
    if (typeof methods[key] !== "function") return;

    getters[key] = target => methods[key].bind(target);
  });
}

function parseMixinComputed({ computed }, { getters, setters }) {
  keys(computed).forEach(key => {
    const computedProp = computed[key];

    if (key in getters) return;
    if (!["function", "object"].includes(typeof computedProp)) return;

    if (typeof computedProp === "function") {
      getters[key] = target => computedProp.call(target);
    } else {
      if ("get" in computedProp) {
        if (typeof computedProp.get === "function") {
          getters[key] = target => computedProp.get.call(target);
        } else {
          getters[key] = () => computedProp.get;
        }
      }

      if ("set" in computedProp) {
        if (typeof computedProp.set === "function") {
          setters[key] = (target, value) =>
            computedProp.set.call(target, value);
        }
      }
    }
  });
}

export default (mixin, hooks) => {
  [parseMixinActions, parseMixinMethods, parseMixinComputed].forEach(parser =>
    parser(mixin, hooks)
  );
};
