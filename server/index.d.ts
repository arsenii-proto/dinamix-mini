export module DinamixMiniServer {
  interface Facade {
    Server: Server.Facade;
  }
}

export module DinamixMiniServer.Server {
  interface Facade {
    when: {
      open: (callback: Function) => Facade;
      connection: ConnectionObservable;
      message: MessageObservable;
      connectionClose: ConnectionObservable;
      close: (callback: Function) => Facade;
    };
    connections: Array<Connection>;
    open: (port: number) => void;
  }

  interface Connection {
    when: {
      message: ConnectionMessageObservable;
      close: Observable;
    };
    send: (data: Object) => Boolean;
    close: () => Boolean;
    request: any;
  }

  interface Observable {
    map: (map: Function) => Observable;
    filter: (filter: Function) => Observable;
    subscribe: (handler: Function) => Observable;
  }

  interface ConnectionObservable {
    map: (map: ConnectionObservableCallback) => Observable;
    filter: (filter: ConnectionObservableCallback) => Observable;
    subscribe: (handler: ConnectionObservableCallback) => Observable;
  }

  interface MessageObservable {
    map: (map: MessageObservableCallback) => MessageObservable;
    filter: (filter: MessageObservableCallback) => MessageObservable;
    subscribe: (handler: MessageObservableCallback) => MessageObservable;
  }

  interface ConnectionMessageObservable {
    map: (
      map: ConnectionMessageObservableCallback
    ) => ConnectionMessageObservable;
    filter: (
      filter: ConnectionMessageObservableCallback
    ) => ConnectionMessageObservable;
    subscribe: (
      handler: ConnectionMessageObservableCallback
    ) => ConnectionMessageObservable;
  }

  interface ConnectionObservableCallback {
    (connection: Connection): void;
  }

  interface MessageObservableCallback {
    (data: MessageObservableCallbackData): void;
  }

  interface ConnectionMessageObservableCallback {
    (data: ConnectionMessageObservableCallbackData): void;
  }

  interface MessageObservableCallbackData {
    connection: Connection;
    message: Object;
    raw: String;
  }

  interface ConnectionMessageObservableCallbackData {
    message: Object;
    raw: String;
  }
}
