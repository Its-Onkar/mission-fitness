import mongoose from "mongoose"
import User from "../Schema/user.schema.js"



export const createUser = async (userData) => {
    const user = await (await User.create(userData)).save()
    if (!user) {
        throw new Error("user not created")
    }
    return user
}


export const getUserByUserName = async (userName) => {
    const user = await User.findOne({ userName })

    if (!user) {
        throw new Error("User not found")
    }
    return user
}

export const getUserById = async (id) => {
    const user = await User.findById(
        {
            _id: new mongoose.Types.ObjectId(id)
        }
    )
}
export const getAllUsers = async () => {
    const users = await User.find({})
    if (!users) {
        throw new Error("Users not found")
    }
    return users
}

export const updateUserByUserName = async (username, updateData) => {
    const findByUserName = await User.findById({
        userName: username
    })
    const user = await User.findOneAndUpdate({
        userName: userName
    }, {
        $set: updateData
    }, {
        new: true,
        runValidators: true
    })

}


export const deleteUserById = async (id) => {
    const user = await User.findByIdAndDelete({
        _id: new mongoose.Types.ObjectId(id)
    })

    if (user) {
        throw new Error("User not deleted")
    }
    return {
        message: "User deleted successfully",
        user
    }
}