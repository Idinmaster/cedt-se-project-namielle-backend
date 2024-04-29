const { addRoomType } = require('../controllers/roomTypes');

const RoomType = require("../models/RoomType");


// Mock the RoomType model
jest.mock("../models/RoomType");


describe('addRoomType Controller Test', () => {
    let mockReq, mockRes, mockNext;


    beforeEach(() => {
        mockReq = {
            body: {
                name: "Test Room Type",
                personLimit: 2,
                price: 100,
                roomLimit: 5,
                hotel: "hotel_id"
            }
        };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });


    it('should create a room type successfully', async () => {
        RoomType.create.mockResolvedValue(mockReq.body); // Assume successful creation returns the request body
        
        await addRoomType(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: true,
            data: mockReq.body
        });
    });


    it('should handle errors when creating a room type', async () => {
        const error = new Error("Failed to create room type");
        RoomType.create.mockRejectedValue(error); // Simulate an error during creation

        await addRoomType(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: error.message
        });
    });


    it('should handle missing or invalid fields', async () => {
        const invalidReq = { body: { name: "", personLimit: 0, price: -100, roomLimit: 0, hotel: "" } };

        await addRoomType(invalidReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Please provide all the required fields with valid values, including 'hotel'"

        });

    });


    
});
