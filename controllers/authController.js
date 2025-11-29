
import { compareSync, hashSync } from "bcrypt";
import { prismaClient } from "../routes/index.js";
import jwt from "jsonwebtoken"

export const RegisterController = async(req,res)=>{
    const {name,email,password,phoneNo,address,pincode}= req.body;

    if(!name || !email || !password || !phoneNo || !address || !pincode){
        return res.status(400).json({message:"Please fill all the fields"})
    }

    const userExists = await prismaClient.user.findFirst({
        where:{
            email : email
        }
    })

    if(userExists){
        return res.status(400).json({
            message:"User already exists"
        })    
    }

   const hashPassword = hashSync(password,10)

    const user = await prismaClient.user.create({
        data:{
            name, 
            email,
            password:hashPassword,
            phoneNo,
            address,
            pincode
        }
    })

    return res.status(201).json({
        message:"User Registered Successfully",
        user
    })
}

export const LoginController = async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"})
    }

    const user = await prismaClient.user.findFirst({
        where:{
            email:email
        }
    })

    if(!user){
        return res.status(400).json({message:"User Not Found"})
    }

    if(email === process.env.Admin_EMAIL && password === process.env.ADMIN_PASSWORD){
        const token = await jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.status(200).json({
            message:"Admin LoggedIn Successfully",
            token,
            user
        })
    }

    const isPasswordValid = await compareSync(password,user.password);

    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid Password"})
    }
    const token = await jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1d'})

    return res.status(200).json({
        message:"Login Successful",
        token,
         user
    })
}

