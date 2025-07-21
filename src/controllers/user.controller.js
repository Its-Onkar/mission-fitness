import { createUser, deleteUserById, getUserByUserName, updateUserByUserName } from "../services/user.service.js";

export  const  createUserController=async(req,res)=>{
    try {

        const  userData =req.body
        
        const  newUser=await createUser(userData)
        res.status(201).json({ message: "User created successfully", user: newUser });
        
    } catch (error) {
        
    }
}
export const getUserByUserNameController=async(req,res)=>{
    try {
        const { userName } = req.params;
        const user = await getUserByUserName(userName);
        res.status(200).json({ user });
        
    } catch (error) {
        
    }
}


export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export  const  getAllUsersController= async(req,res)=>{
    try{
        const users= await getAllUsers()

        res.status(200).json({ users });
    }
    catch(error){
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const updateUserByUserNameController = async (req, res) => {
    try {
        const { userName } = req.params;
        const updateData = req.body;
        const updatedUser = await updateUserByUserName(userName, updateData);
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteUserById(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};