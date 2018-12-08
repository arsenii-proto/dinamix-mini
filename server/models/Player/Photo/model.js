/** @type {MongoZilla.Model.Schema} */
const schema = {
  colection: "aaaas",
  blueprint: {
    tid: Number.required,
    first_name: {
      type: String,
      required: true
    },
    surname: String.enum(["male", "female"]).required,
    middle_name: String,
    sex: {
      type: String,
      required: true,
      enum: ["male", "female"]
    }
  },
  methods: {}
};

export default schema;
