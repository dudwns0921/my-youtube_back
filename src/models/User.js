import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  password: { type: String, unique: true },
  avartarURL: { type: String, default: 'static/images/defaultAvartar.png' },
})

userSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 5)
})

const UserModel = mongoose.model('User', userSchema)
export default UserModel
