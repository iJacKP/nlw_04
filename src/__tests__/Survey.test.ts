import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from "../database";

describe ("Surveys", ()=>{
    beforeAll(async() =>{
        const connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll( async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close()
    })

    it("Should be able to create new survey", async() =>{
        const res = await request(app).post("/surveys").send({
            title:"Title example",
            description:"Description example",
        })

     expect(res.status).toBe(201);
     expect(res.body).toHaveProperty("id");
    })

    it("Should be able to get all surveys",async ()=>{
        await request(app).post("/surveys").send({
            title:"Title Example",
            description:"Description Example"
        })
        const res = await request(app).get("/surveys")

        expect(res.body.length).toBe(2);
    })
})