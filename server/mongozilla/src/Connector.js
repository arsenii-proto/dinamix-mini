import { MongoClient } from "mongodb";
import query from "@/mongozilla/src/Query";

const connections = {
  default: null
};

const create = options => {
  const { database, user, password, ...rest } = options;
  const client = new MongoClient({
    ...rest,
    auth: {
      user,
      password
    }
  });

  const db = client.db(database);

  return {
    get connected() {
      return client.isConnected();
    },
    get query() {
      return query();
    },
    collection(name) {
      return query(db.collection(name));
    },
    close() {
      client.close();
    }
  };
};

const facade = {
  getConnection(name) {
    if (name in connections) {
      return connections[name];
    }

    return null;
  },
  createConnection(name, options) {
    let conn = connections[name];

    if (!(name in connections)) {
      conn = create(options);
      connections[name] = conn;
    }

    conn.connect(options);

    return conn;
  }
};

export default facade;
