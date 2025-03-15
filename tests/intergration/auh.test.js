import { server } from "../.."
import request from "supertest"
import { User } from "../../models/user"
import { Genre } from "../../models/genre"

describe("auth middleware", () => {

    let token;

    const exec = () => {
        return request(server)
        .post("/api/genres")
        .set('x-auth-token', token)
        .send({ name: "genre1"})
    }

    beforeEach(() => {
        server.close();
        server.listen(3000); 
        token = new User().generateAuthToken();
    })

    afterEach(async () => {
        server.close(); 
        await Genre.collection.deleteMany({});
    })

    it('Should return  401 if no token is provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('Should return  400 if no token is invalid', async () => {
        token = '123';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('Should return  200 if token is valid', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
})
