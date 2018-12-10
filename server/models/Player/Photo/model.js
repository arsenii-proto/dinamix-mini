/** @type {MongoZilla.Model.Schema} */
const schema = {
  colection: "aaaas",
  props: {
    tid: {
      $type: Number,
      $required: true,
      $min: 10,
      $max: 20,
      $defualt: 16,
      $in: [10, 12, 14, 16, 18, 20],
      $validator: tid => {
        return tid % 2 == 0;
      }
    },
    first_name: {
      $type: String,
      $required: true,
      $defualt: "Arsenii",
      $in: ["Arsenii", "Cojocari"],
      $minLength: 16,
      $maxLength: 46,
      $validator: firstName => {
        return /^[A-Z].+$/.test(firstName);
      },
      $mapper: firstName => {
        return (
          firstName.substr(0, 1).toLocaleUpperCase() +
          firstName.substr(1, firstName.length).toLocaleLowerCase()
        );
      }
    },
    surname: {
      $type: String,
      $required: true,
      $in: ["male", "female"]
    },
    middle_name: String,
    sex: {
      $type: String,
      $required: true,
      $in: ["male", "female"]
    }
  },
  methods: {}
};

export default schema;
