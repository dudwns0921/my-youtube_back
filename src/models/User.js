import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String, unique: true },
})

userSchema.pre('save', async function () {
  console.log('User pwd before hash: ', this.password)
  this.password = await bcrypt.hash(this.password, 5)
  console.log('User pwd after hash: ', this.password)
})

const UserModel = mongoose.model('User', userSchema)
export default UserModel
