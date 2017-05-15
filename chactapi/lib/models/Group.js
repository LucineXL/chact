const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupname: {
        type:String,
        unique:true,//不可重复约束
        require:true
    },
    messages : [{
        type:Schema.Types.ObjectId,
        ref: 'Message'
    }],
    created: {
        type: Date,
        default: Date.now()
    }
})
GroupSchema.statics.getGroup = function(groupname) {
  return this.findOne({ groupname }).exec();
};
GroupSchema.statics.getGroupMessage = function(groupname) {
  return this.findOne({ groupname })
  .populate({
    path: 'messages',
    options: {
      sort: { _id: -1 },
      limit: 30,
    },
    populate: {
      path: 'user',
      select: 'username avatar',
    },
  })
  .exec();
};

module.exports = mongoose.model('Group',GroupSchema);
