import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { get } from "mongoose";
import { getReceiverSocketID, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUser = req.user._id;
        const filteresUsers = await User.find({_id:{ $ne: loggedInUser}}).select("-password");
        res.status(200).json(filteresUsers);
    }
    catch(error){
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({error: error.message});
    }
}

export const getMessages = async (req, res) => {
    
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        });

        res.status(200).json({messages});
    }
    catch(error){
        console.log("Error in updateProfile", error.message);
        res.status(500).json({error: error.message});
    }
}

export const sendMessages = async (req, res) => {
    try{
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        const {text, image} = req.body;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }


        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        
        const receiverSocketID = getReceiverSocketID(receiverId);
        if(receiverSocketID){
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }
        res.status(201).json({newMessage});
    }
    catch(error){
        console.log("Error in sendMessages", error.message);
        res.status(500).json({error: error.message});
    }
}