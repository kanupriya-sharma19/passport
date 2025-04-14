import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String},
  mobile_no: { type: String },
  age: { type: Number},
  grade: { type: String },
  profile_image: { type: String } 
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);

export { User };
