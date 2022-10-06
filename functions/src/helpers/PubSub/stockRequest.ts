import { PubSub } from "@google-cloud/pubsub";

const pubsub = new PubSub();
type MessageType={
    message:string,
    action:string,
    date:string,
    type:string
}
//TODO:Publishers are users
//TODO:All subscriptions and topics are published by product manager

//TODO: Write the message handler function and recieve meesage from the pub sub and send emails to the product manager
//TODO:One function to send the stock to the customer
function RequestStock(message:MessageType) {
    process.env.GOOGLE_API_KEYS=__dirname +"/serviceKey.json"
    const data = JSON.stringify(message)
    const dataBuffer = Buffer.from(data)
    const TopicName = "StockRequest"
    
    return pubsub
}
