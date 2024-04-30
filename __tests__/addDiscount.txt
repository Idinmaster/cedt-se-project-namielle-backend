const { getDiscounts, getDiscount } = require("../controllers/discounts");
const Discount = require("../models/Discount");

const request = require("supertest");
const app = require("../server");


describe("Get all discounts", () => {
    beforeEach(async () => {
        await Discount.deleteMany({});
        await request(app)
            .post("/api/v1/discounts")
            .set(
                "Authorization",
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
            )
            .set("Content-Type", "application/json")
            .send({
                name: "test1",
                info: "test1",
                code: "test1",
                percentage: 10,
                image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            });
        await request(app)
            .post("/api/v1/discounts")
            .set(
                "Authorization",
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
            )
            .set("Content-Type", "application/json")
            .send({
                name: "test2",
                info: "test2",
                code: "test2",
                percentage: 20,
                image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            });
        await request(app)
            .post("/api/v1/discounts")
            .set(
                "Authorization",
                `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
            )
            .set("Content-Type", "application/json")
            .send({
                name: "test3",
                info: "test3",
                code: "test3",
                percentage: 30,
                image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            });
    });
    it("test get all", async () => {
        const response = await request(app).get("/api/v1/discounts");
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.length).toBe(3)
    });

    it("test get one", async () => {
        const test1 = await Discount.findOne({name: "test1"});
        const response = await request(app).get(`/api/v1/discounts/${test1._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("test1");
        expect(response.body.data.info).toBe("test1");
        expect(response.body.data.code).toBe("test1");
        expect(response.body.data.percentage).toBe(10);
        expect(response.body.data.image).toBe("https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    });
},10000);

describe("Create discounts", () => {
    it("Create discount if it does not exist", async () => {
        await Discount.deleteMany({});
        const response = await request(app)
        .post("/api/v1/discounts")
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test1",
            info: "test1",
            code: "test1",
            percentage: 10,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
    });

    it("Update discount if it exist", async () => {
        const response = await request(app)
        .post("/api/v1/discounts")
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test2",
            info: "test2",
            code: "test1",
            percentage: 20,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("test2");
        expect(response.body.data.info).toBe("test2");
        expect(response.body.data.code).toBe("test1");
        expect(response.body.data.percentage).toBe(20);
        expect(response.body.data.image).toBe("https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    });
},10000);

describe("Update discounts", () => {
    beforeEach(async () => {
        await Discount.deleteMany({});
        await request(app)
        .post("/api/v1/discounts")
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test1",
            info: "test1",
            code: "test1",
            percentage: 10,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
    });
    it("Update valid discount", async () => {
        const test1 = await Discount.findOne({name: "test1"});
        const response = await request(app)
        .put(`/api/v1/discounts/${test1._id}`)
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test2",
            info: "test2",
            code: "test2",
            percentage: 20,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("test2");
        expect(response.body.data.info).toBe("test2");
        expect(response.body.data.code).toBe("test2");
        expect(response.body.data.percentage).toBe(20);
        expect(response.body.data.image).toBe("https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
    });
    it("Update invalid discount", async () => {
        const response = await request(app)
        .put(`/api/v1/discounts/invalid_discount`)
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test2",
            info: "test2",
            code: "test2",
            percentage: 20,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
},10000);

describe("Delete discounts", () => {
    beforeEach(async () => {
        await Discount.deleteMany({});
        await request(app)
        .post("/api/v1/discounts")
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test1",
            info: "test1",
            code: "test1",
            percentage: 10,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
    });
    it("Delete discount", async () => {
        const test1 = await Discount.findOne({name: "test1"});
        const response = await request(app)
        .delete(`/api/v1/discounts/${test1._id}`)
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test2",
            info: "test2",
            code: "test2",
            percentage: 20,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });
    it("Update invalid discount", async () => {
        const response = await request(app)
        .put(`/api/v1/discounts/invalid_discount`)
        .set(
            "Authorization",
            `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTQ2YjdmMzhkOGI3YWJmOTllYTRmNCIsImlhdCI6MTcxNDM4NTM5NywiZXhwIjoxNzE2OTc3Mzk3fQ.ZOmC6lMWHpOXmBDrBxCa4ACzRpSNtrrbmtUidqVr8yU`
        )
        .set("Content-Type", "application/json")
        .send({
            name: "test2",
            info: "test2",
            code: "test2",
            percentage: 20,
            image: "https://images.unsplash.com/photo-1714244322811-f1387dc93909?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });
},10000);
