const { StatusCodes } = require('http-status-codes')

const { BookingService } = require('../services/index');

const bookingService = new BookingService();

const { createChannel, publishMessage } = require('../utils/messageQueue');

const { REMINDER_BINDING_KEY } = require('../config/serverConfig')

class BookingController{
    constructor(){
       
    }

    async sendMessageToQueue (req, res) {
        const channel = await createChannel();
        const data = {message: 'SUCCESS'}
        publishMessage(channel , REMINDER_BINDING_KEY, JSON.stringify(data));
        return res.status(200).json({
            message: "Successfully published the event"
        })
    }

    async create (req, res) {
        try {
            const response = await bookingService.createBooking(req.body);
            console.log("From booking Controller : ",response);
            return res.status(StatusCodes.OK).json({
                message: "Successfully completed Booking",
                sucess: true,
                err: {},
                data:response
            })
        } 
        catch (error) {
            console.log("From booking Controller Error : ",error)
            return res.status(error.statusCode).json({
                message: error.message,
                sucess: false,
                err: error.explanation,
                data: {}
            })
        }
    }
}


module.exports = BookingController;