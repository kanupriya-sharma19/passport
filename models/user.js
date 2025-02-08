import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema=new mongoose.Schema({
email:{type:String,required:true},
username: { type: String, required: true},
mobile_no: { type: String,required: true },
alternate_no:{ type: String,required: true }
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User',userSchema);

export{User};