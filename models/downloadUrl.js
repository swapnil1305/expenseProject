const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const downloadUrlSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    fileURL: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('DownloadUrl', downloadUrlSchema);