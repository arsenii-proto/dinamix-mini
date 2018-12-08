export default function(schema) {
  Object.defineProperty(this, "schema", {
    get() {
      return schema;
    }
  });
}
