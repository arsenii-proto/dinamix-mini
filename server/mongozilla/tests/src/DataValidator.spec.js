import { expect } from "chai";
import DataValidator from "./../../src/DataValidator";
import Type from "./../../src/Type";

describe.only("mongozilla/src/DataValidator", () => {
  it("should be a function", () => {
    expect(DataValidator).to.be.a("function");
  });

  it("should validate correct data and blueprint", () => {
    const data = {
      name: "Andrei",
      age: 22
    };

    const blueprint = {
      name: Type.string
        .minLength(5)
        .maxLength(10)
        .in(["Andrei", "Sasa"]).required,
      age: Type.number.min(18).max(140).required,
      country: Type.string.in(["USA", "Moldova"]).or("Moldova")
    };

    expect(DataValidator(data, blueprint)).to.deep.equal({
      isValid: true,
      value: { ...data, country: "Moldova" }
    });
  });

  it("should not validate wrong data and blueprint", () => {
    const data = {
      name: "Andrei",
      age: 22
    };

    const blueprint = {
      name: Type.string
        .minLength(5)
        .maxLength(10)
        .in(["Andreika", "Sasa"]).required,
      age: Type.number.min(50).max(140).required,
      country: Type.string.in(["USA", "Moldova"]).or("Moldovan")
    };

    expect(DataValidator(data, blueprint)).to.have.property("isValid", false);
  });
});
