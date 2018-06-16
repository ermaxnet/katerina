const { connect, disconnect } = require("../api/database");
const request = require("supertest");
const app = require("../api");
const Sight = require("../models/sight");
const Comment = require("../models/comment");

const IP = "37.44.78.50";
const SIGHT_ID = "5b1f703c22dd4f58247928e2";
const SIGHT_WITHOUT_COMMENTS_ID = "5b1f703d22dd4f58247928e3";

const COMMENT = {
    comment: { email: "dariussgr2@hotmail.com", text: "Я опять же согласен с Катериной. Нужно что то делать." }
};
const SIGHT = {
    sight: {
        link: "https://ru.wikipedia.org/wiki/%D0%9D%D0%B5%D1%81%D0%B2%D0%B8%D0%B6%D1%81%D0%BA%D0%B8%D0%B9_%D0%B7%D0%B0%D0%BC%D0%BE%D0%BA",
        official_site: "http://niasvizh.by/en/",
        email: "eremin_my@outlook.com"
    }
};

describe("Тестирование API", () => {
    beforeAll(done => {
        connect({ NODE_ENV: "test" }).then(mongoose => {
            return require("mais-mongoose-seeder")(mongoose)
                .seed(require("./test-db.json"), { 
                    dropDatabase: false, dropCollections: true 
                });
        }).then(() => {
            done();
        });
    });

    describe("/api", () => {
        describe("/geolocation", () => {
            describe("GET /lang", () => {
                let response = null;
                beforeAll(async () => {
                    response = await request(app)
                        .get("/api/geolocation/lang")
                        .set("X-Forwarded-For", IP);
                });
                test("должен возвращать статус запроса 200", () => {
                    expect(response.statusCode).toBe(200);
                });
                test("должен возвращать язык be", () => {
                    const { lang } = response.body;
                    expect(lang).toBe("be");
                });
            });
            describe("GET /ip", () => {
                test(`должен вернуть ${IP}`, async () => {
                    const response = await request(app)
                        .get("/api/geolocation/ip")
                        .set("X-Forwarded-For", IP)
                    expect(response.body).toBe(IP);
                });
            });
        });
        describe("/api/sights", () => {
            describe("GET /sights", () => {
                let response = null;
                beforeAll(async () => {
                    response = await request(app).get("/api/sights");
                });
                test("должно возвращать статус запроса 200 когда в БД хранятся достопримечательности", () => {
                    expect(response.statusCode).toBe(200);
                });
                test("должен возвращать массив с достопримечательностями", () => {
                    expect(response.body).toHaveLength(2);
                });
            });
            describe(`GET /sight/${SIGHT_ID}`, () => {
                let response = null;
                beforeAll(async () => {
                    response = await request(app).get(`/api/sight/${SIGHT_ID}`);
                });
                test("должен возвращать статус запроса 200", () => {
                    expect(response.statusCode).toBe(200);
                });
                test("должен возвращать достопримечательность", () => {
                    expect(response.body).toBeDefined();
                    expect(new Sight(response.body)).toHaveProperty("id", SIGHT_ID);
                });
            });
            describe(`GET /sight/${SIGHT_ID}/?lang=be`, () => {
                test("должен возвращать локализованное имя достопримечательности", async () => {
                    const response = await request(app).get(`/api/sight/${SIGHT_ID}/?lang=be`);
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toBeDefined();
                    expect(new Sight(response.body)).toHaveProperty("name", "Хатынь");
                });
            });
            describe(`GET /sight/${SIGHT_ID}/comments`, () => {
                let response = null;
                beforeAll(async () => {
                    response = await request(app).get(`/api/sight/${SIGHT_ID}/comments`);
                });
                test("должен возвращать статус запроса 200", () => {
                    expect(response.statusCode).toBe(200);
                });
                test("должен возвращать массив с комментариями по достопримечательности", () => {
                    expect(response.body).toHaveLength(2);
                });
            });
            describe(`GET /sight/${SIGHT_WITHOUT_COMMENTS_ID}/comments`, () => {
                test("должен возвращать статус запроса 204 для достопримечательности без комментариев", async () => {
                    const response = await request(app).get(`/api/sight/${SIGHT_WITHOUT_COMMENTS_ID}/comments`);
                    expect(response.statusCode).toBe(204);
                });
            });
            describe(`POST /sight/${SIGHT_ID}/rate`, () => {
                test("должен вернуть статус запроса 400 если передана неверная оценка", async () => {
                    const response = await request(app).post(`/api/sight/${SIGHT_ID}/rate`)
                        .send({ rate: 20 }).set("Content-Type", "application/json");
                    expect(response.statusCode).toBe(400);
                });
                test("должен вернуть статус запроса 202", async () => {
                    const response = await request(app).post(`/api/sight/${SIGHT_ID}/rate`)
                        .send({ rate: 10 }).set("Content-Type", "application/json");
                    expect(response.statusCode).toBe(202);
                });
                test("должен пересчитывать оценку достопримечательности с учетом оценки пользователя", async () => {
                    const response = await request(app).post(`/api/sight/${SIGHT_ID}/rate`)
                        .send({ rate: 0 }).set("Content-Type", "application/json");
                    expect(response.body).toBe(5);
                });
            });
            describe(`PUT /sight/${SIGHT_WITHOUT_COMMENTS_ID}/comment`, () => {
                let response = null;
                beforeAll(async () => {
                    response = await request(app).put(`/api/sight/${SIGHT_WITHOUT_COMMENTS_ID}/comment`)
                        .send(COMMENT).set("Content-Type", "application/json");
                });
                test("должен возвращать статус запроса 201", () => {
                    expect(response.statusCode).toBe(201);
                });
                test("должен возвращать созданный комментарий", () => {
                    expect(response.body).toBeDefined();
                    expect(new Comment(response.body)).toHaveProperty("email", COMMENT.comment.email);
                    expect(new Comment(response.body)).toHaveProperty("text", COMMENT.comment.text);
                });
                describe(`GET /sight/${SIGHT_WITHOUT_COMMENTS_ID}/comments`, () => {
                    test("должен возвращать новое число комментариев для достопримечательности", async () => {
                        response = await request(app).get(`/api/sight/${SIGHT_WITHOUT_COMMENTS_ID}/comments`);
                        expect(response.body).toHaveLength(1);
                    });
                })
            });
            describe("PUT /sight", () => {
                test("должен возвращать статус запроса 201", async () => {
                    const response = await request(app).put(`/api/sight`)
                        .send(SIGHT).set("Content-Type", "application/json");
                    expect(response.statusCode).toBe(201);
                });
            });
        });
    });

    afterAll(done => {
        disconnect().then(done).catch(done);
    });
});