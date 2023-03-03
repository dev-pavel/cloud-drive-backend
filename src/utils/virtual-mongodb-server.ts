import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

export const ConnectDB = async () => {
    const mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
}

export const ClearDB = async () => {
    const collections = mongoose.connection.collections;

    for (let collection in collections) {
        await collections[collection].deleteMany({});
    }
}

export const CloseDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoose.disconnect();
}