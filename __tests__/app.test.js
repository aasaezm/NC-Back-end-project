const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("app", () => {
  describe("GET - /api/topics", () => {
    test("Responds with an array of topic objects, with 'slug' and 'description' properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: topicsArray }) => {
          expect(Array.isArray(topicsArray)).toBe(true);
          expect(topicsArray.length).toBe(3);
          expect(topicsArray[0]).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
          //   expect(Object.keys(topicsArray[0])).toEqual(["slug", "description"]);
        });
    });

    test("Status 404, responds with an error message when the path is not found", () => {
      return request(app)
        .get("/api/not-a-path")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Path not found");
        });
    });
  });
});
