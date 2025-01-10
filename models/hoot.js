const mongoose = require('mongoose');

// comment schema which is embedded inside hoot model
const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);


// hoot model
const hootSchema = new mongoose.Schema(
    {
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['News', 'Sports', 'Games', 'Movies', 'Music', 'Television'],
    },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      comments: [commentSchema]
    },
    { timestamps: true }
);
    // registering the model
    const Hoot = mongoose.model('Hoot', hootSchema);

    // exporting the model
    module.exports = Hoot;


  