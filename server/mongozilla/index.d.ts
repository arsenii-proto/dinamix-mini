export module MongoZilla {
  interface Facade {
    Model: Model.FactoryBuilder;
    Type: Type.Facade;
    Connector: Connector.Facade;
  }
}

export module MongoZilla.Model {
  interface Schema {
    /** Connection Name */
    connection?: string;
    /** Collection Name */
    colection: string;
    /** Model Blueprint */
    blueprint: object;
    /** Model intance methods */
    methods?: object;
    /** Database Actions */
    actions?: object;
    /** Computed props */
    computed?: object;
    /** Contruct lifecycle */
    construct?: Function;
    /** Validating lifecycle */
    validating?: Function;
    /** Validated lifecycle */
    validated?: Function;
    /** Model props Validator */
    validator?: Function;
    /** Saving lifecycle */
    saving?: Function;
    /** Saved lifecycle */
    saved?: Function;
    /** Retrieved lifecycle */
    retrieved?: Function;
    /** Creating lifecycle */
    creating?: Function;
    /** Created lifecycle */
    created?: Function;
    /** Updating lifecycle */
    updating?: Function;
    /** Updated lifecycle */
    updated?: Function;
    /** Deleting lifecycle */
    deleting?: Function;
    /** Deleted lifecycle */
    deleted?: Function;
    /** Refreshed lifecycle */
    refreshed?: Function;
  }

  interface Factory {}

  interface FactoryBuilder {
    (schema: Schema): Factory;
  }
}

export module MongoZilla.Type {
  interface Facade {
    bool: BooleanChecker;
    string: StringChecker;
    number: NumberChecker;
    array: ArrayChecker;
    object: ObjectChecker;
  }

  interface BooleanChecker {
    validate: (value: Boolean) => ValidateResult<Boolean>;
    is: IsValue<Boolean>;
    required: BooleanChecker;
    or: DefaultValue<Boolean, BooleanChecker>;
  }

  interface StringChecker {
    validate: (value: String) => ValidateResult<String>;
    is: IsValue<String>;
    required: StringChecker;
    or: DefaultValue<String, StringChecker>;
    in: InValue<String, StringChecker>;
    minLength: MinLengthValue<StringChecker>;
    maxLength: MaxLengthValue<StringChecker>;
  }

  interface NumberChecker {
    validate: (value: Number) => ValidateResult<Number>;
    is: IsValue<Number>;
    required: NumberChecker;
    or: DefaultValue<Number, NumberChecker>;
    in: InValue<Number, NumberChecker>;
    min: MinValue<Number, NumberChecker>;
    max: MaxValue<Number, NumberChecker>;
  }

  interface ArrayChecker {
    validate: (value: Array<any>) => ValidateResult<Array<any>>;
    is: IsValue<Array<any>>;
    required: ArrayChecker;
    or: DefaultValue<Array<any>, ArrayChecker>;
    of: OfType<ArrayChecker>;
    minLength: MinLengthValue<ArrayChecker>;
    maxLength: MaxLengthValue<ArrayChecker>;
  }

  interface ObjectChecker {
    validate: (value: Object) => ValidateResult<Object>;
    is: IsValue<Object>;
    required: ObjectChecker;
    prop: (prop: String) => ObjectChecker;
    props: (propsList: Array<String>) => ObjectChecker;
  }

  interface ValidateResult<T> {
    isValid: Boolean;
    value: T;
  }

  interface IsValue<T> {
    (value: T): Boolean;
  }

  interface DefaultValue<T, C> {
    (defaultalue: T): C;
  }

  interface InValue<T, C> {
    (values: Array<T>): C;
  }

  interface MinValue<T, C> {
    (min: T): C;
  }

  interface MaxValue<T, C> {
    (max: T): C;
  }

  interface MinLengthValue<T> {
    (minLength: Number): T;
  }

  interface MaxLengthValue<T> {
    (maxLength: Number): T;
  }

  interface OfType<T> {
    (type: any): T;
  }
}

export module MongoZilla.Connector {
  interface Facade {
    getConnection: (name: String) => Connection;
    createConnection: (name: String, options: ConnectionOptions) => Connection;
  }

  interface Connection {
    connected: Boolean;
    query: MongoZilla.Query.Facade;
    close: () => Boolean;
    collection: (name: String) => MongoZilla.Query.Facade;
  }

  interface ConnectionOptions {
    url: String;
    database: String;
    user: String;
    password: String;
  }
}

export module MongoZilla.Query {
  interface Facade {}
}
