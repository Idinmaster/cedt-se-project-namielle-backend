const { createHotel } = require("../controllers/hotels");
const Hotel = require("../models/Hotel");

jest.mock("../models/Hotel");

describe("Create Hotel", () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = { body: { name: "cu hotel", city: "pathumwan", tel: "099-987-9879", address: "Bangkok", file: "cuhotel.png", capacity: 8} };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });
    it("Create Hotel valid", async () => {
        Hotel.create.mockResolvedValue(mockReq.body);

        await createHotel(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            data: mockReq.body,
        });
    });

    it("Create Hotel name invalid", async () => {
        mockReq = { body: { name: "", city: "", tel: "", address: "", file: "", capacity: 0} };

        await createHotel(mockReq, mockRes, mockNext);
        const error = new Error("Invalid data")
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: error.message,
        });

    });

    it("Create hotel simulate error ", async () => {
        const error = new Error("Failed to create hotel");
        Hotel.create.mockRejectedValue(error); // Simulate an error during creation
        await createHotel(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: error.message,
        });

    });

});
