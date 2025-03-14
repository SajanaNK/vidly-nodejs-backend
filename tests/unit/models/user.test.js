import { User } from "../../../models/user";
import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";

describe("user.generateAuthToken", () => {
    it("should return a valid JWT" , () => {

        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        }

        const user = new User(payload);

        const token = user.generateAuthToken();
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decode).toMatchObject(payload);

    })
})