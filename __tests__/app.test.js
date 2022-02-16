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
  describe("GET - /api/articles/:article_id", () => {
    test("Get an article based on the id supplied", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              author: expect.any(String),
              article_id: 1,
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test("Status 404 - for valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe(
            "No article found for article_id: 1000"
          );
        });
    });
    test("Status 400 - Bad request when submitted an invalid ID", () => {
      return request(app)
        .get("/api/articles/invalid-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Invalid input");
        });
    });
  });

  describe("Users", () => {
    describe("GET - api/users", () => {
      test("Status 200 - Responds with an array of objects, and each object has a property of 'username'", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: users }) => {
            expect(Array.isArray(users)).toBe(true);
            expect(users).toEqual([
              { username: "butter_bridge" },
              { username: "icellusedkars" },
              { username: "rogersop" },
              { username: "lurker" },
            ]);
          });
      });
    });
  });
});
