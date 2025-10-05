import { Inngest } from "inngest";
import User from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "Xpose-app" });

// Ingest Function to save use data to database 
const syncUserCreation=inngest.createFunction(
    {id:"sync-user-from-clerk"},
    {event:"clerk/user.created"},
    async({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data
        let username=email_addresses[0].email_addresses.split("@")[0]
        // Check availability of user name 
        const user=await User.findOne({username})
        if(user){
            username=username+Math.floor(Math.random()*1000)
        }

        const userData={
            _id:id,
            email:email_addresses[0].email_addresses,
            full_name:first_name + " " + last_name,
            profile_picture:image_url,
            username
        }
        await User.create(userData)

    }
)

// Ingest function to update user data in database 


const syncUserUpdation=inngest.createFunction(
    {id:"update-user-from-clerk"},
    {event:"clerk/user.updated"},
    async({event})=>{
        const {id,first_name,last_name,email_addresses,image_url}=event.data
        
        const updateUserData={
            email:email_addresses[0].email_addresses,
            full_name:first_name + " " + last_name,
            profile_picture:image_url
        } 
    
       
        await User.findByIdAndUpdate(id,updateUserData)

    }
)

// Ingest function to delete user from data base
const syncUserDeletion=inngest.createFunction(
    {id:"delete-user-with-clerk"},
    {event:"clerk/user.deleted"},
    async({event})=>{
        const {id}=event.data
        
        
    
       
        await User.findByIdAndDelete(id)

    }
)


// Create an empty array where we'll export future Inngest functions
export const functions = [
    syncUserCreation,
    syncUserUpdation,
    syncUserDeletion,
];

