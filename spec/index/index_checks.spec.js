var request = require('request');
var base = 'http://localhost:8080';
var data = {};
var server = require('../../server.js');

describe("Test Server Start", () => {
    beforeAll(() => {
        server = require('../../server.js');
    });
    afterAll(() => {
        server.closeServer();
    });
    describe("GET /", () => {
        beforeAll((done) => {
            request.get(base + '/', (error, response, body) => {
                data.response = response;
                data.status = response.statusCode;
                data.body = body;
                done();
            });
        });
        it("Status Code 200", () => {
            expect(data.status).toBe(200);
        });
        it("Body", () => {
            expect(data.body).toBe("Hello World");
        });
    });
    //describe("GET /test", () => {
    //    beforeAll((done) => {
    //        request.get(base + "/test", (error, response, body) => {
    //            data.status = response.statusCode;
    //            data.body = JSON.parse(body);
    //            done();
    //        });
    //    });
    //    it("Status 200", () => {
    //        expect(data.status).toBe(500);
     //   });
     //   it("Body", () => {
     //       expect(data.body.message).toBe("This is an error response");
     //   });
    //});
});
