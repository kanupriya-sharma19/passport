import mongoose from 'mongoose';
import validator from 'validator'; 

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: [validator.isEmail, "Please provide a valid email address"],  
  },  password: {
    type: String,
    required: true, minlength: [6, "Password must be at least 6 characters long"]
  },
  username: { type: String },
  mobile_no: { type: String },
  age: { type: Number },
  grade: { type: String },
  profile_image: { type: String },
});

const User = mongoose.model('User', userSchema);

export { User };

