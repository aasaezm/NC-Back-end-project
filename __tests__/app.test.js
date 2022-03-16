const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection.js");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection.js");

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
    describe("GET - /api/articles", () => {
      test("Status 200: Responds with an array of sorted articles by date in descending order, with its properties and the count of comments for each article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
            expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
            expect(articles[articles.length - 1].created_at).toBe(
              "2020-01-07T14:08:00.000Z"
            );
            expect(articles[0].comment_count).toBe("2");
            expect(articles[5].comment_count).toBe("11");
          });
      });
    });
    describe("GET - /api/articles/:article_id", () => {
      test("Get an article based on the id supplied and gives the total amount of comments for that article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                title: expect.any(String),
                author: expect.any(String),
                article_id: 1,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: "11",
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
          .then(({ body: { patchedArticle } }) => {
            expect(patchedArticle).toEqual(
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
          .then(({ body: { patchedArticle } }) => {
            expect(patchedArticle).toEqual(
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
    describe("GET /api/articles (queries)", () => {
      test("Status 200 - sorts articles by article_id in descendent order", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=desc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].article_id).toBe(12);
            expect(articles[articles.length - 1].article_id).toBe(1);
            expect(articles.length).toBe(12);
          });
      });
      test("Status 200 - sorts articles by title in ascendent order for the topic mitch", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc&topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].title).toBe("A");
            expect(articles[articles.length - 1].title).toBe("Z");
            expect(articles.length).toBe(11);
          });
      });
      test("Status 200 - Filters the articles by the topic value specified", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).toEqual(
              expect.objectContaining({
                title: "UNCOVERED: catspiracy to bring down democracy",
                topic: "cats",
                author: "rogersop",
              })
            );
          });
      });
      test("Status 400: Invalid query order", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=not-valid")
          .expect(400)
          .then(({ body }) => {
            const { msg: message } = body;
            expect(message).toBe("Invalid query order");
          });
      });
      test("Status 400: Invalid query sort_by", () => {
        return request(app)
          .get("/api/articles?sort_by=NOT-VALID&order=desc")
          .expect(400)
          .then(({ body }) => {
            const { msg: message } = body;
            expect(message).toBe("Invalid query sort_by");
          });
      });
      test("Status 404: Topic not found", () => {
        return request(app)
          .get("/api/articles?topic=not-a-topic")
          .expect(404)
          .then(({ body }) => {
            const { msg: message } = body;
            expect(message).toBe("topic not found on articles table");
          });
      });
      test("Status 200: When an invalid topic is provided, it gets ignored and returns the articles requested", () => {
        return request(app)
          .get("/api/articles?topic=")
          .then(({ body: { articles } }) => {
            expect(articles[0]).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
            expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
            expect(articles[articles.length - 1].created_at).toBe(
              "2020-01-07T14:08:00.000Z"
            );
            expect(articles[0].comment_count).toBe("2");
            expect(articles[5].comment_count).toBe("11");
          });
      });
    });
  });

  describe("Comments", () => {
    describe("GET - /api/articles/:article_id/comments", () => {
      test("Status 200 - Gets an array of comments for the given article Id", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments.length).toBe(11);
            expect(comments[0]).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("Status 400 - Bad request when invalid input is passed", () => {
        return request(app)
          .get("/api/articles/one/comments")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request: Invalid Input");
          });
      });
      test("Status 404 - Valid request but item not found", () => {
        return request(app)
          .get("/api/articles/100/comments")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No article found for article_id: 100");
          });
      });
    });
    describe("DELETE - /api/comments/:comments_id", () => {
      test("Status 204 - Deletes the given comment by its id", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204)
          .then(() => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                for (let i = 0; i < comments.length; i++) {
                  expect(comments.comment_id).not.toBe(2);
                }
                expect(comments.length).toBe(10);
                db.query(`SELECT * FROM comments WHERE comment_id = 2;`).then(
                  ({ rows }) => {
                    expect(rows).toEqual([]);
                  }
                );
              });
          });
      });
      test("Status 404 - The comment to delete does not exist", () => {
        return request(app)
          .delete("/api/comments/1000")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No comment found for comment_id: 1000");
          });
      });
      test("Status 400 - Invalid Id", () => {
        return request(app)
          .delete("/api/comments/one")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request: Invalid Input");
          });
      });
    });

    describe("POST - /api/articles/:articles_id/comments", () => {
      test("Status 201 - Responds with the newly posted comment. The new comment accepts an object with 'username' and 'body' properties", () => {
        const body = {
          username: "rogersop",
          body: "I highly recommend this!",
        };
        return request(app)
          .post("/api/articles/2/comments")
          .send(body)
          .expect(201)
          .then(({ body: { postedComment } }) => {
            expect(postedComment).toEqual(
              expect.objectContaining({
                comment_id: 19,
                body: "I highly recommend this!",
                author: "rogersop",
              })
            );
          });
      });
      test("Status 400 - Bad request when malformed body or missing required fields", () => {
        const body = {};
        return request(app)
          .post("/api/articles/2/comments")
          .send(body)
          .expect(400)
          .then(({ body: { msg: errorMessage } }) => {
            expect(errorMessage).toBe(
              "Bad Request: Malformed body / Missing required fields"
            );
          });
      });
      test("Status 400 - Bad request when passed invalid input i.e. Passing an author that still doesn't exist in the database", () => {
        const body = { username: "quarki", body: "Woow" };
        return request(app)
          .post("/api/articles/2/comments")
          .send(body)
          .expect(400)
          .then(({ body: { msg: errorMessage } }) => {
            expect(errorMessage).toBe(
              "Bad Request: Either the article or the author to be input still doesn't exist in the database"
            );
          });
      });
      test("Status 400 - Bad request when passed an empty body", () => {
        const body = { username: "rogersop", body: "" };
        return request(app)
          .post("/api/articles/2/comments")
          .send(body)
          .expect(400)
          .then(({ body: { msg: errorMessage } }) => {
            expect(errorMessage).toBe(
              "Bad Request: Malformed body / Missing required fields"
            );
          });
      });
      test("Status 400 - The article to which the comment is to be attached, doesn't exist", () => {
        const body = { username: "rogersop", body: "Woow" };
        return request(app)
          .post("/api/articles/100/comments")
          .send(body)
          .expect(400)
          .then(({ body: { msg: errorMessage } }) => {
            expect(errorMessage).toBe(
              "Bad Request: Either the article or the author to be input still doesn't exist in the database"
            );
          });
      });
    });
  });

  describe("Users", () => {
    describe("GET - api/users", () => {
      test("Status 200 - Responds with an array of objects, and each object has a property of 'username'", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(Array.isArray(users)).toBe(true);
            expect(users).toEqual([
              {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
              {
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              },
              {
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              },
              {
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              },
            ]);
          });
      });
    });
  });

  describe("API", () => {
    describe("GET - api", () => {
      test("Status 200 - Returns a JSON describing all the available endpoints in the API", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body: endpoints }) => {
            expect(endpoints["GET /api"].description).toBe(
              "serves up a json representation of all the available endpoints of the api"
            );
            expect(endpoints["GET /api/articles"].queries[0]).toBe("author");
            expect(endpoints["GET /api/articles"].queries.length).toBe(4);
          });
      });
    });
  });
});
