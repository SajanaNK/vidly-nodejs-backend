import { User } from "../../../models/user";
import { auth } from "../../../middleware/auth";
import {jest} from '@jest/globals';
import mongoose from "mongoose";

describe('auth middleware', () => { 
    
    it("Should populate req.user with the payload of valid JWT", () => {
        const user = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const token = new User(user).generateAuthToken();
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toBeDefined();
    });

 })