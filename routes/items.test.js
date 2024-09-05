process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let skittles = {
    name: "Skittles",
    price: 3.50
};

beforeEach(function() {
    items.push(skittles);
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", () => {
    test("Get all items", async () => {
        const res = await request(app).get("/items");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ items: [skittles] });
    });
});

describe("GET /items/:name", () => {
    test("Get item by name", async () => {
        const res = await request(app).get(`/items/${skittles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: skittles });
    });
    test("Responds with 404 for invalid item", async () => {
        const res = await request(app).get(`/items/Twix`);
        expect(res.statusCode).toBe(404);
    });
});

describe("POST /items", () => {
    test("Creating an item", async () => {
        const res = await request(app).post("/items").send({
            name: "Starburst",
            price: 2.10
        });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ item: {
            name: "Starburst",
            price: 2.10
            } 
        });
    });
    test("Responds with 400 if name is missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    });
});

describe("PATCH /items/:name", () => {
    test("Updating an item's name and price", async () => {
        const res = await request(app).patch(`/items/${skittles.name}`).send({
            name: "SourSkittles",
            price: 4.05
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: {
            name: "SourSkittles",
            price: 4.05
            } 
        });
    });
    test("Responds with 404 for invalid name", async () => {
        const res = await request(app).patch(`/items/Gobstoppers`).send({
            name: "SourSkittles",
            price: 4.05
        });
        expect(res.statusCode).toBe(404);
    });
});

describe("DELETE /items/:name", () => {
    test("Deleting an item", async () => {
        const res = await request(app).delete(`/items/${skittles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: 'Deleted' });
    });

    test("Responds with 404 for deleting invalid item", async () => {
        const res = await request(app).delete(`/items/hamface`);
        expect(res.statusCode).toBe(404);
    });
});