import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please add a name']
    },
    email: {
        type: String,
        require: [true, 'Please add an email'],
        unique:true
    },
    password: {
        type: String,
        require: [true, 'Please enter password']
    },
}, {
    timestamps: true
});

const UserModel = mongoose.model('Users', userSchema)

export default UserModel