const expect = require("chai").expect;
const request = require("request");

describe("Video Conferencing App API", function () {
  describe("Langing page", function () {
    var url = "http://localhost:8000/";

    it("returns status 200", function (done) {
      request(url, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe("Room page", function () {
    var url = "http://localhost:8000/0a9-742a-490";

    it("returns status 200", function (done) {
      request(url, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });

  describe("Thank you page", function () {
    var url = "http://localhost:8000/thankyou/0a9-742a-490";

    it("returns status 200", function (done) {
      request(url, function (error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  });
});
