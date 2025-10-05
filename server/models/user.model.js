import mongoose ,{Schema}from "mongoose";
import { Profiler } from "react";


const userSchema= new Schema({
    _id:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,


    },
    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    bio:{
        type:String,
        default:"Hey there! I am using Xpose"
    },
    Profile_picture:{
        type:String,
        default:""
    },
    cover_photo:{
        type:String,
        default:"",

    },
    location:{
        type:String,
        default:""
    },
    followers

},{})