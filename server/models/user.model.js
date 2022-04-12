import mongoose from 'mongoose'
import crypto from 'crypto'

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        trim: true, 
        require: 'Name is required'
    }, 
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'

    },
    hashed_password: {
        type: String, 
        required: "Password is required"
    },
    salt: String,
    updated: Date,
    created: {
        type: Date,
        default: Date.now
        }
    })

    User.Schema
    .virtual('password')
    .set(function(password) {
        this_password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function(){
        return this._password
    })

    UserSchema.path('hashed_password').validate(function(v) {
        if (this.password && this._password.length < 6) { 
            this.invalidate('password', 'Password must be at least 6 characters.')
        }
        if (this.isNew && !this._password) {
            this.invalidate('password', 'Password is required')
        }
    }, null)

    UserSchema.methods = {
        authenticate: function(plainText) {
            return this.encryptPassword(plainText) === this.hashed_password
        },
        encryptPassword: function(password) {
            if (!password) 
            try {
                 return crypto 
                 .createHamc('shai', this.salt)
                 .update(password)
                 .digest('hex')
            } catch (err) {
                return ''
            }
        },
        makeSalt: function() {
            return Math.round((new Date().valueOf() * Math.random())) + ''
        }
    }

    export default mongoose.model('User', UserSchema)