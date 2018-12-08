import Player from "@/models/Player/model";
import { Model } from "@/mongozilla";

const models = {
  Player
};

const inited = {};

export default new Proxy(inited, {
  /** @returns {MongoZilla.Model.Factory} */
  get(_, prop) {
    if (prop in inited) {
      inited[prop];
    }

    if (prop in models) {
      return (inited[prop] = Model(models[prop]));
    }
  }
});
