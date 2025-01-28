import User from '../models/user.model';

import { connect } from '../mongodb/mongoose';

interface UserPayload {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
    email_addresses: string;
    username: string;
}

export const createOrUpdateUser = async({
    id,
    first_name,
    last_name,
    image_url,
    email_addresses,
    username
}:UserPayload) => {
    try{
        await connect();
        const user = await User.findOneAndUpdate(
            {clerkId:id},
            {
                $set:{
                    firstName: first_name,
                    lastName: last_name,
                    profilePicture: image_url,
                    email: email_addresses,
                    username,
                },
            },{new: true, upsert: true} // if there is user.id to update and it'll create a new one
        );
        return user;
    }catch(error){
        console.log("Error creating or updating user:",error);
    }
};

export const deleteUser = async (id:string) => {
    try{
        await connect();
        await User.findOneAndDelete({clerkId:id});
    }catch(error){
        console.log('Error deleting user:',error);
    }
}