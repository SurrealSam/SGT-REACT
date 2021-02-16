const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item = new Schema({ type: String, sku: String}, 
    { collection : 'sgtInventory' });


module.exports = mongoose.model('Item', Item);