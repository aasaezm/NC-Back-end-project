const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("app", () => {
  describe("Topics", () => {
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

  describe("Articles", () => {
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
            expect(body.msg).toBe("Bad Request: Invalid Input");
          });
      });
    });
    describe("PATCH - /api/articles/:article_id", () => {
      test("Status 200 - The votes from the selected article are increased by the provided amount", () => {
        const body = { inc_votes: 1 };
        return request(app)
          .patch("/api/articles/2")
          .send(body)
          .expect(200)
          .then(({ body: patchedArticle }) => {
            expect(patchedArticle.article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                author: expect.any(String),
                article_id: 2,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 1,
              })
            );
          });
      });
      test("Status 200 - The votes from the selected article are decreased by the provided amount", () => {
        const body = { inc_votes: -57 };
        return request(app)
          .patch("/api/articles/1")
          .send(body)
          .expect(200)
          .then(({ body: patchedArticle }) => {
            expect(patchedArticle.article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                author: expect.any(String),
                article_id: 1,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: 43,
              })
            );
          });
      });
      test("Status 400 - Bad request when malformed body / missing required fields", () => {
        const body = {};
        return request(app)
          .patch("/api/articles/1")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            const { msg: message } = body;
            expect(message).toBe(
              "Bad Request: Malformed body / Missing required fields"
            );
          });
      });
      test("Status 400 - Bad request when invalid input is passed", () => {
        const body = { inc_votes: "hello" };
        return request(app)
          .patch("/api/articles/2")
          .send(body)
          .expect(400)
          .then(({ body }) => {
            const { msg: message } = body;
            expect(message).toBe("Bad Request: Invalid Input");
          });
      });
      test("Status 404 - The input data is correct but the item to be patched is not found", () => {
        const body = { inc_votes: 4 };
        return request(app)
          .patch("/api/articles/500")
          .send(body)
          .expect(404)
          .then(({ body }) => {
            const { msg: message } = body;
            expect(message).toBe("No article found for article_id: 500");
          });
      });
    });
  });

  xdescribe("GET - /api/articles/:article_id/comments", () => {
    test("Status 200 - Gets an array of comments for the given article Id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then((response) => {
          expect(response.body).objectContaining({
            comment_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
    });
  });
});
