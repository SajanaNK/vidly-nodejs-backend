import { Rental } from "../../models/rental";
import { server } from "../..";
import { Movie } from "../../models/movie";
import mongoose from "mongoose";
import request from "supertest"
import { User } from "../../models/user";
import moment from "moment";

describe("/api/returns", () => {
    
    let customerId;
    let movieId;
    let rental;
    let movie;
    let token;

    const exec = () => {
        return request(server)
        .post("/api/returns")
        .set( 'x-auth-token', token)
        .send({customerId: customerId, movieId: movieId});
    }
    
    beforeEach( async () => {
        server.close();
        server.listen(3000);

        token = new User().generateAuthToken();

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        movie = new Movie({
            _id: movieId,
            title: "12345",
            dailyRentalRate: 2,
            genre: {name: "12345"},
            numberInStock: 10
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "123456",
                phone: "1234567890"
                
            },
            movie: {
                _id: movieId,
                title: "12345",
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach(async () => {
        server.close();
        token = "";
        await Rental.collection.deleteMany({});
        await Movie.collection.deleteMany({});
    });

    it("Should return 401 if client is not Loged in", async () => {
        token = '';
        await Rental.collection.deleteMany({});
        const res = await exec();
        expect(res.status).toBe(401);
    })

    it("Should retun 400 if customer id is not provided", async () => {
        customerId = '';
        const res = await exec();    
        expect(res.status).toBe(400);
    });

    it("Should retun 400 if movie id is not provided", async () => {
        movieId = '';
        const res = await exec();       
        expect(res.status).toBe(400);
    });
    
    it("Should retun 404 if rental not found", async () => {  
        await Rental.collection.deleteMany({});    
        const res = await exec();       
        expect(res.status).toBe(404);
    });

    it("Should retun 400 if rental is already processed", async () => {  
        await Rental.updateOne({_id: rental._id}, {dateReturned: new Date()});
        const res = await exec();       
        expect(res.status).toBe(400);
    });

    it("Should retun 200 if valid request", async () => {  
        const res = await exec();       
        expect(res.status).toBe(200);
    });

    it("Should set the return date if input is valid", async () => {
        const res = await exec();
        const rentalInDb = await Rental
        .findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it("Should set the rental fee if input is valid", async () => {
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it("Should Increase the movie stock if input is valid ", async () => {
        const prevStock = movie.numberInStock;
        const res = await exec();
        const movieInDb = await Movie.findById({_id : movieId});
        expect(movieInDb.numberInStock).toBeGreaterThan(prevStock);
    })

    it("Should return the rental if input is valid ", async () => {
        const res = await exec();
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            "dateOut",
            "dateReturned",
            "rentalFee",
            "customer",
            "movie"
        ]));
    })

    
})