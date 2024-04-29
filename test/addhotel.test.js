const { createHotel } = require('../controllers/hotels');
const Hotel = require("../models/Hotel");


// Mock the Hotel model
jest.mock("../models/Hotel");

describe('createHotel Controller Test', () => {
    let mockReq, mockRes, mockNext;


    beforeEach(() => {
        mockReq = { body: { name: "Test Hotel", location: "Test Location" } };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });-


    it('should create a hotel successfully', async () => {
        Hotel.create.mockResolvedValue(mockReq.body); // Assume successful creation returns the request body
        
        await createHotel(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            data: mockReq.body
        });
    });



    it('should handle errors when creating a hotel', async () => {
        const error = new Error("Failed to create hotel");
        Hotel.create.mockRejectedValue(error); // Simulate an error during creation

        await createHotel(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false

        });

    });
    
});
