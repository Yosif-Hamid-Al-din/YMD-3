const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const authUserSchema = new Schema({
    username:String,
    email:String,
    password:String,
    profileImage:String,
    customerinfo: [
        {
            firseName:String,
            lastName:String,
           email:String,
            phoneNumber:Number,
            age:Number,
            country:String,
            gender:String,
            createdAt: Date,
            updatedAt: { type: Date, default: Date.now },
        },
    ],
})

authUserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
   });
const AuthUser = mongoose.model('User',authUserSchema)
module.exports = AuthUser