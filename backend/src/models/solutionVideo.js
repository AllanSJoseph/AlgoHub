const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'problem',
        required: true
    },
    userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
   },
   sourceType: {
    type: String,
    enum: ['cloudinary', 'youtube', 'local'],
    default: 'cloudinary'
   },
   cloudinaryPublicId: {
    type: String,
    required: function () {
      return this.sourceType === 'cloudinary';
    },
    sparse: true
  },
  secureUrl: {
    type: String,
    required: function () {
      return this.sourceType !== 'youtube';
    }
  },
  youtubeUrl: {
    type: String
  },
  localPath: {
    type: String
  },
  originalName: {
    type: String
  },
  thumbnailUrl: {
    type: String
  },
  duration: {
    type: Number,
    default: 0
  },
},{
    timestamps:true
});



const SolutionVideo = mongoose.model("solutionVideo",videoSchema);

module.exports = SolutionVideo;
