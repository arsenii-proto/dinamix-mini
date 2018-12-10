import { expect } from "chai";
import { Server, MongoZilla } from "../../index";

describe("@/index.js", () => {
  it("should export Server facade", () => {
    expect(Server).to.be.a("object");
  });
  it("should export MongoZilla facade", () => {
    expect(MongoZilla).to.be.a("object");
  });
});
