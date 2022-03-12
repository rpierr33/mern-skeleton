import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({ 
    name: {
        type: String,
        trim: true, 
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true, 
        unique: 'This email already exist',
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
        required: 'This email is required'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    hashed_password: {
        type: String,
        required: 'Password is required'
    },
    salt: String,
    updated: Date, 
})
UserSchema 
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptedPassword(password)
    })
    .get(function () {
        return this._password
    })

UserSchema.path('hashed_password').validate(function(v) {
    if(this._password && this._password.length > 6) {
        this.invalidate('password', 'Password must be at least 6 characters')
    }
    if(this.isNew && !this._password) {
        this.invalidate('password', 'Password is required')
    }
}, null)

UserSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptedPassword(plainText) === this.hashed_password
    },
    encryptedPassword: function(password) {
        if (!password) return ''
        try {
            return crypto
            .createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch (err) {
            return ''
        }
    }, 
    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random)) + ''
    }  
}
export default mongoose.model('User', UserSchema)