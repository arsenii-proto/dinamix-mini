import { expect } from "chai";
import Server from "../../../utils/Server";

const isObserver = observer => {
  try {
    expect(observer).to.have.property("subscribe");
    expect(observer).to.have.property("unsubscribe");
    expect(observer).to.have.property("filter");
    expect(observer).to.have.property("map");
    return true;
  } catch (ex) {
    return false;
  }
};

describe("@/utils/Server.js", () => {
  describe("when property", () => {
    it("should be an object", () => {
      expect(Server.when).to.be.a("object");
    });
    it("should have expected props", () => {
      expect(Server.when).to.have.property("open");
      expect(Server.when).to.have.property("connection");
      expect(Server.when).to.have.property("message");
      expect(Server.when).to.have.property("connectionClose");
      expect(Server.when).to.have.property("close");
    });
    describe("property open", () => {
      it("should be an Function", () => {
        const observer = Server.when.open;

        expect(observer).to.be.a("function");
      });
    });
    describe("property connection", () => {
      it("should be an Observer", () => {
        const observer = Server.when.connection;

        expect(observer).to.be.a("object");
        expect(isObserver(observer)).to.be.true;
      });
    });
  });
});
