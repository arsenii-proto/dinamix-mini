import Type from "@/mongozilla/src/utils/Type";
import Model from "@/mongozilla/src/Model";
import Connector from "@/mongozilla/src/Connector";

/** @type {MongoZilla.Facade} */
const facade = { Model, Type, Connector };

export default facade;
