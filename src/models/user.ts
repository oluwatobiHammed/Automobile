import mongoose from 'mongoose';
import { Password } from '../routes/auth/services/password';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  fname: string;
  lname: string;
  phonenumber: string;
  email: string;
  password: string;
  avatar?: Buffer;
  referralcode?: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  fname: string;
  lname: string;
  phonenumber: string;
  email: string;
  password: string;
  referralcode?: string;
  avatar?: Buffer;
}

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true
    },
    lname: {
      type: String,
      required: true,
      trim: true
    },
    phonenumber: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7
    },
    
    referralcode: {
      type: String,
      trim: true
    },
    avatar: {
      type: Buffer
    },
    
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);
userSchema.set('timestamps', true)
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
