import mongoose from 'mongoose';

let initialized = false;

export const connect = async () => {
    mongoose.set('strictQuery',true);
    if (initialized){
        console.log('Already connected to Mongodb');
        return;
    }
    try{
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the environment variables.');
          }
          
        await mongoose.connect(process.env.MONGO_URI || '', {
            dbName: 'next-blog',
            });

        console.log('Connect to MongoDB');
        initialized=true;
    }catch(error){
        console.log("Error connecting to MongoDB:",error);
    }
};