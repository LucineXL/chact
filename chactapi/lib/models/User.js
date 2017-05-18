const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        unique:true,//不可重复约束
        require:true //不可为空约束
    },
    password:{
        type:String,
        require:true //不可为空约束
    },
    sex:{
        type:String
    },
    birthday:{
        type:String
    },
    email:{
        type:String
    },
    address:{
        type:String
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }]
})
UserSchema.statics.getUser = function(username) {
  return this.findOne({ username }).exec();
};
UserSchema.statics.getUserGroup = function (username) {
    return this.findOne({username})
    .populate({path:'groups'})
    .exec();
}
UserSchema.statics.getUserMessage = function(username) {
  return this.findOne({ username }).populate({
    path: 'groups',
    populate: {
      path: 'messages',
      options: {
        sort: { _id: -1 },
        limit: 30,
      },
      populate: {
        path: 'user',
        select: 'username',
      }
    },
  });
};

module.exports = mongoose.model('User',UserSchema);
