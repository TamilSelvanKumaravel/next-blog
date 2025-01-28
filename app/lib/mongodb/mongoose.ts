import mongoose from 'mongoose';

let initialized = false;

export const connect = async () => {
    mongoose.set('strictQuery',true);
    if (initialized){
        console.log('Already connected to Mongodb');
        return;
    }
    try{
        const options = {
            dbName: 'next-blog',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(process.env.MONGO_URI as string, options);

        console.log('Connect to MongoDB');
        initialized=true;
    }catch(error){
        console.log("Error connecting to MongoDB:",error);
    }
};