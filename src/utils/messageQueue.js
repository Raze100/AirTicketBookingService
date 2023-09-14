const amqplib = require('amqplib');
const {EXCHANGE_NAME,MESSAGE_BROKER_URL} = require('../config/serverConfig')
const createChannel = async() => {
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel();

        /*
        setting the exchange distributer
        based on what msg we have and at what queue it have to be sent it redirects our tasks
        */
        
        
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);
        return channel;
    } 
    catch (error) {
        throw error
    }
}

//subscribe here means it is listening the sended requests from other microservices
const subscribeMessage = async(channel, service, binding_key) => {
   try {
    const applicationQueue = await channel.assertQueue('QUEUE_NAME');

    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

    channel.consume(applicationQueue.queue, msg => {
        console.log('Recieved Data');
        console.log(msg.content.toString());
        channel.ack(msg);
    })
   } 
   catch (error) {
        throw error;
   }
}

//publishing here means it is sending the requests to other microservices 
const publishMessage = async(channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME');
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));

    } catch (error) {
        throw error;
    }
}
module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}