const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Movement = new Schema({}, 
    { collection : 'sgtInventory' },  { strict: false });


module.exports = mongoose.model('Movement', Movement);