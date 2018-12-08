import { expect } from "chai";
import Type from "./../../src/Type";

describe("mongozilla/src/Type", () => {
  describe("string", () => {
    it("should validate 'Test String'", () => {
      const { string } = Type;
      const value = "Test String";

      expect(string).to.be.a("object");
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should validate empty string", () => {
      const { string } = Type;
      const value = "";

      expect(string).to.be.a("object");
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should not validate undefined", () => {
      const { string } = Type;
      const value = undefined;

      expect(string).to.be.a("object");
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });

    it("should not validate null", () => {
      const { string } = Type;
      const value = null;

      expect(string).to.be.a("object");
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });

    it("should not validate 123", () => {
      const { string } = Type;
      const value = 123;

      expect(string).to.be.a("object");
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });

    it("should implement flag required", () => {
      const { string } = Type;

      expect(string.required).to.be.eq(string);
    });

    it("should validate 'Test String' having required flag", () => {
      const { string } = Type;
      const value = "Test String";

      expect(string.required).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should not validate empty string having required flag", () => {
      const { string } = Type;
      const value = "";

      expect(string.required).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });

    it("should implement or mapper", () => {
      const { string } = Type;

      expect(string.or).to.be.a("function");
    });

    it("should validate 'Test String' having or mapping", () => {
      const { string } = Type;
      const value = "Test String";

      expect(string.or(value)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should validate empty string having or mapping", () => {
      const { string } = Type;
      const value = "";
      const orValue = "Test String";

      expect(string.or(orValue)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value: orValue
      });
    });

    it("should validate undefined having or mapping", () => {
      const { string } = Type;
      const value = undefined;
      const orValue = "Test String";

      expect(string.or(orValue)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value: orValue
      });
    });

    it("should implement in validator", () => {
      const { string } = Type;

      expect(string.in).to.be.a("function");
    });

    it("should validate 'Test String' having in validator ['Test String', 'Another Test String']", () => {
      const { string } = Type;
      const value = "Test String";
      const inList = ["Test String", "Another Test String"];

      expect(string.in(inList)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should not validate 'Test String' having in validator with ['Some Test String', 'Another Test String']", () => {
      const { string } = Type;
      const value = "Test String";
      const inList = ["Some Test String", "Another Test String"];

      expect(string.in(inList)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });

    it("should implement minLength validator", () => {
      const { string } = Type;

      expect(string.minLength).to.be.a("function");
    });

    it("should validate 'Test String' having minLength validator with 5", () => {
      const { string } = Type;
      const value = "Test String";
      const minL = 5;

      expect(string.minLength(minL)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should validate 'Test String' having minLength validator with 15", () => {
      const { string } = Type;
      const value = "Test String";
      const minL = 15;

      expect(string.minLength(minL)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });

    it("should implement maxLength validator", () => {
      const { string } = Type;

      expect(string.maxLength).to.be.a("function");
    });

    it("should validate 'Test String' having maxLength validator with 15", () => {
      const { string } = Type;
      const value = "Test String";
      const minL = 15;

      expect(string.maxLength(minL)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: true,
        value
      });
    });

    it("should validate 'Test String' having maxLength validator with 5", () => {
      const { string } = Type;
      const value = "Test String";
      const minL = 5;

      expect(string.maxLength(minL)).to.be.eq(string);
      expect(string.validate(value)).to.be.deep.equal({
        isValid: false,
        value
      });
    });
  });

  describe("number", () => {
    it("should validate 12", () => {
      const { number } = Type;
      const value = 12;

      expect(number).to.be.a("object");
      expect(number.validate(value)).to.deep.equal({
        isValid: true,
        value
      });
    });

    it("should validate 0", () => {
      const { number } = Type;
      const value = 0;

      expect(number.validate(value)).to.deep.equal({
        isValid: true,
        value
      });
    });

    it("should not validate undefined", () => {
      const { number } = Type;
      const value = undefined;

      expect(number.validate(value)).to.deep.equal({
        isValid: false,
        value
      });
    });

    it("should not validate 'Test String'", () => {
      const { number } = Type;
      const value = "Test String";

      expect(number.validate(value)).to.deep.equal({
        isValid: false,
        value
      });
    });
  });
});
