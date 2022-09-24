import request from "supertest";
import startApplication from "../../main/application";

describe("application", () => {
    const app = startApplication();

    it("should configure", () => {
        expect(app).toBeTruthy();
    });

    describe("test", () => {
        const testRoutePath = "/test";

        describe("GET route", () => {
            it("should return a 200", async () => {
                const response = await request(app).get(testRoutePath);
                expect(response.statusCode).toEqual(200);
                expect(response.body).toEqual("This is a test GET payload");
            });
        });

        describe("POST route", () => {
            it("should return a 200", async () => {
                const response = await request(app).post(testRoutePath);
                expect(response.statusCode).toEqual(200);
            });
        });

        describe("PUT route", () => {
            it("should return a 200", async () => {
                const response = await request(app).put(testRoutePath);
                expect(response.statusCode).toEqual(200);
            });
        });

        describe("DELETE route", () => {
            it("should return a 200", async () => {
                const response = await request(app).delete(testRoutePath);
                expect(response.statusCode).toEqual(200);
            });
        });
    });

    // describe('listener server', () => {

    // });
});
