#! /usr/bin/env node

//import dnd_shirt from './public/images/dnd_shirt.jpg'
//import cleric_shirt from './public/images/cleric_shirt.jpg'

console.log(
    'This script populates some test items to your database. Specified database as argument '
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item");
  const items = [];

  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function itemCreate(index, item_name, description, category, price, number, img_url) {
    const item = new Item({  
            item_name: item_name,
            description: description ,
            category: category,
            price: price,
            number_in_stock: number,
            //img_url: img_url,
        });
    await item.save();
    items[index] = item;
    console.log(`Added item: ${item_name}`);
  }
  
 
  async function createItems() {
    console.log("Adding items");
    await Promise.all([
      itemCreate(0, 
        "MothMan AirTag Holder", 
        "Mothman wallet for AirTag Kawaii leather Cryptid holder for Air Tag",
        "Keychain",
        26.99,
        4
        ),
      itemCreate(1, "Dungeon and Dragons Shirt", 
        "Dungeons and Dragons Sword D20 Shirt",
        "Clothing",
        15.99,
        3,
        //"/public/images/dnd_shirt.jpg"
        ),
      itemCreate(2, "Healing Word Shirt",
        "Healing word DnD classic cleric tee shirt",
        "Clothing",
        21.99,
        2,
        //"/public/images/cleric_shirt.jpg"
        ),
    ]);
  }
  