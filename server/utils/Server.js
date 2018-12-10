import { Server as WSServer } from "ws";

const createStream = () => {
  const listeners = [];
  const fire = data => listeners.forEach(listener => listener(data));
  const subscribe = listener => {
    listeners.push(listener);
    return { unsubscribe: () => unsubscribe(listener) };
  };
  const unsubscribe = listener =>
    Boolean(
      listeners.splice(listeners.findIndex(it => it !== listener)).length
    );

  return {
    fire,
    subscribe,
    unsubscribe
  };
};

const createObserver = stream => {
  let current = -1;
  let observer;
  const flow = [];
  const call = (func, data) => typeof func === "function" && func(data);
  const next = data => {
    if (current + 1 >= flow.length) return;
    flow[++current](data, next);
  };
  const filter = func =>
    Boolean(flow.push((data, next) => call(func, data) && next(data))) &&
    observer;
  const map = func =>
    Boolean(flow.push((data, next) => next(call(func, data)))) && observer;
  const subscribe = func =>
    Boolean(flow.push((data, next) => (call(func, data), next(data)))) &&
    observer;

  const rejectable = stream.subscribe(data => ((current = -1), next(data)));
  const unsubscribe = () => rejectable.unsubscribe();

  return (observer = {
    map,
    filter,
    subscribe,
    unsubscribe
  });
};

const wrapConnection = (conn, request) => {
  const currentConn = {
    when: {
      get message() {
        const observer = createObserver(messageStream);
        observer
          .filter(({ connection }) => connection === currentConn)
          .map(({ raw, message }) => ({ raw, message }));
        return observer;
      },
      get close() {
        const observer = createObserver(connectionCloseStream);
        observer.filter(({ connection }) => connection === currentConn);
        return observer;
      }
    },
    send(data) {
      try {
        const message = JSON.stringify(data);
        conn.send(message);
        return true;
      } catch (ex) {
        return false;
      }
    },
    get request() {
      return request;
    },
    close() {
      conn.close();
    }
  };

  return currentConn;
};

const openStream = createStream();
const connectionStream = createStream();
const messageStream = createStream();
const connectionCloseStream = createStream();
const closeStreamInternal = createStream();
const closeStream = createStream();

let connections = [];
let serverInstance = {
  port: null,
  opened: null,
  retries: 0
};

/** @type {DinamixMiniServer.Server.Facade} */
const Server = {
  when: {
    open(callback) {
      openStream.subscribe(callback);
      if (serverInstance.opened === true) {
        callback(Server);
      }
      return Server;
    },
    get connection() {
      return createObserver(connectionStream);
    },
    get message() {
      return createObserver(messageStream);
    },
    get connectionClose() {
      return createObserver(connectionCloseStream);
    },
    close(callback) {
      closeStream.subscribe(callback);
      if (serverInstance.opened === false) {
        callback({ server: Server });
      }
      return Server;
    }
  },
  get connections() {
    return connections.filter(() => true);
  },
  open(portNumber) {
    if (serverInstance.port) return;

    serverInstance.port = portNumber;
    closeStreamInternal.fire();
  }
};

export default Server;

closeStreamInternal.subscribe(() => {
  if (!serverInstance.port) {
    return;
  }

  if (serverInstance.retries >= 5) {
    return setTimeout(() => {
      throw new Error("Server killed by reconect tries limit");
    });
  }

  const server = new WSServer({ port: serverInstance.port });

  connections = [];
  server.on("error", error => {
    server.close();
    closeStream.fire({ server: Server, error });
  });
  server.on("connection", (c, r) => {
    const connection = wrapConnection(c, r);

    connectionStream.fire(connection);
    c.on("close", () => connectionCloseStream.fire(connection));
    c.on("error", error => c.close(error));
    c.on("message", raw => {
      let message;
      try {
        message = JSON.parse(raw);
      } catch (ex) {
        message = undefined;
      }

      messageStream.fire({
        connection,
        raw,
        message
      });
    });

    serverInstance.retries = 0;
  });

  openStream.fire(Server);
  process.on("exit", () => server.close());
  process.on("SIGTERM", () => server.close());
});

closeStream.subscribe(() => {
  setTimeout(() => {
    closeStreamInternal.fire();
    serverInstance.retries++;
  }, 300);
});

openStream.subscribe(() => {
  serverInstance.opened = true;
});

closeStream.subscribe(() => {
  serverInstance.opened = false;
});
