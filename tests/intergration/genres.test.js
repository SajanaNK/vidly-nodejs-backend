
import { server } from "../.."
import request from "supertest"
import { Genre } from "../../models/genre"
import { User } from "../../models/user"
import mongoose from "mongoose"

describe("/api/genres", () => {

    beforeEach(() => {
        server.close();
        server.listen(3000);
    })

    afterEach(async () => {
        server.close();
        await Genre.collection.deleteMany({});
    })

    describe("GET /", () => {


        it("Should return all genres", async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
                { name: 'genre3' }
            ]);
            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
        })
    });

    describe("GET /:id", () => {

        it("Should return a genre if valid id is passed", async () => {
            const addedGenres = await Genre.collection.insertMany([
                { name: 'genre1' }
            ]);

            const res = await request(server).get("/api/genres/" + addedGenres.insertedIds[0]);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", "genre1");

        });

        it("Should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/genres/" + 1);
            expect(res.status).toBe(404);

        });

        it("Should return 404 If no given genre with given id exists", async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get("/api/genres/" + id);
            expect(res.status).toBe(404);

        });

    });

    describe("POST /", () => {

        let token;
        let name;

        const exec = async () => {
            return await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "Genre123";
        })

        it("Should return 401 if client is not logged in", async () => {
            token = '';
            const result = await exec();
            expect(result.status).toBe(401);
        });

        it("Should return 400 if genre is  less than 5 characters", async () => {
            name = "1234";
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it("Should return 400 if genre is more than 50 characters", async () => {
            name = new Array(52).join("a");
            const result = await exec();
            expect(result.status).toBe(400);
        });

        it("Should Save the genre if it is valid", async () => {
            const result = await exec();
            const genre = await Genre.find({ name: "Genre123" });
            expect(genre).not.toBeNull();
            expect(result.status).toBe(200);
        });

        it("Should return the genre if it is valid", async () => {
            const result = await exec();
            expect(result.body).toHaveProperty("_id");
            expect(result.body).toHaveProperty("name", "Genre123");
        });

    });


})