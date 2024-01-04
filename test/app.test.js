import chai from "chai";
import chaiHttp from "chai-http";
import app from "../server.js";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Your Express App Tests", () => {
  it('should return "Server is running" for the root endpoint', (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("message").equal("Server is running");
        done();
      });
  });
});
