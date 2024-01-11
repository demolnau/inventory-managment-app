// Require Mongoose
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  item_name: {type: String, required: true, maxLength:100},
  description: {type: String, required: true, maxLength:100} ,
  category: {type: String},
  price: {type: Number},
  number_in_stock: {type: Number},
  //img_url:{type:String},
});
ItemSchema.virtual("url").get(function(){
    return `/catalog/item/${this._id}`
})

// Compile model from schema
const Item = mongoose.model("ItemModel", ItemSchema);

module.exports = Item