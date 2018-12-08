import { getConnection } from "./Connector";
import parseMixin from "./utils/MixinParser";
import ModelHandler from "./utils/ModelHandler";
import HooksSchema from "./utils/HooksSchema";

const Model = ({ connection, collection, ...rest }) => {
  const conn = getConnection(connection || "default");
  const query = conn.collection(collection);
  const Factory = () => {};
  const hooks = parseSchema(rest, {
    ...HooksSchema,
    getters: {
      query: () => query
    }
  });

  return new Proxy(Factory, ModelHandler(hooks));
};

const parseSchema = (schema, hooks) => {
  extractMixins(schema).forEach(mixin => parseMixin(mixin, hooks));
};

const extractMixins = ({ mixins, rest }) => {
  const all = [rest];

  if (mixins instanceof Array) {
    mixins.forEach(mixin => {
      all.concat(extractMixins(mixin));
    });
  }

  return all;
};

export default Model;
