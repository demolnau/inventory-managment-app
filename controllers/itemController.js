const Item = require("../models/item")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");
const debug = require("debug")("item");

exports.index = asyncHandler( async (req, res, next)=>{
     const numItems = await Item.countDocuments({}).exec();
     res.render("index",{
        title: "Inventory Managment Home",
        item_count: numItems,
     })
});
// display a list of all items in inventory catalog
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems =await Item.find({},"item_name")
        .sort({item_name:1})
        .exec();
    res.render("item_list", {title:"Item List", item_list:allItems})
})

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec();
    if (item===null){
        //no results.
        debug(`id not found on update: ${req.params.id}`);
        const err = new Error("Item not found")
        err.status=404;
        return next(err);
    }
    res.render("item_detail",{
        title: item.item_name,
        item: item
    })
  });
  
// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
    //const allItems= await Item.find({},"name").sort({name:1}).exec();
    res.render("item_form", {
        title:"Create Item", 
        //item_list: allItems,
    });
});

// Handle item create on POST.
exports.item_create_post = [
    body("item_name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("description", "Item description must contain at least 3 characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("category", "Invalid category")
    .optional({ values: "falsy" })
    .trim()
    .isLength({min:3})
    .escape(),
    body("price","Invalid price")
    .optional({ values: "falsy" })
    .isNumeric(),
    body("number_in_stock", "Invalid Number of items in stock").optional({ values: "falsy" }).isNumeric(),
    //body("img_url","Invalid path to image").optional({values:"falsy"}),
    
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const item =new Item({
            item_name: req.body.item_name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            //img_url : req.body.img_url
        })
        if(!errors.isEmpty()){
            //const allItems= await Item.find({},"name").sort({name:1}).exec();
            res.render("item_form",{
                title: "Create Item",
                //item_list : allItems,
                item: item,
                error: errors.array(),
                
            });
            return;
        }
        // if data from form is valid continue
        else{
            //save item
            await item.save()
            //redirect to new item record
            res.redirect(item.url)
        }
    })
]



// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec();
    if(item===null){
        res.redirect("/catalog/items")
    }
    res.render("item_delete",{
        title:"Delete Item",
        item: item,
    })
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    await Item.findByIdAndDelete(req.body.itemid);
    res.redirect("/catalog/items")
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).exec();
    if(item===null){
        //No results 
        debug(`id not found on update: ${req.params.id}`);
        const err =  new Error("Item not found");
        err.status= 404;
        return next(err);
    }
    res.render("item_form",{
        title:"Update Item",
        item: item,
    })
});

// Handle item update on POST.
exports.item_update_post = [
    body("item_name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("description", "Item description must contain at least 3 characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("category", "Invalid category")
    .optional({ values: "falsy" })
    .trim()
    .isLength({min:3})
    .escape(),
    body("price","Invalid price")
    .optional({ values: "falsy" })
    .isNumeric(),
    body("number_in_stock", "Invalid Number of items in stock").optional({ values: "falsy" }).isNumeric(),
    //body("img_url","Invalid path to image").optional({values:"falsy"}),
    
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        const item =new Item({
            item_name: req.body.item_name,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            number_in_stock: req.body.number_in_stock,
            //img_url : req.body.img_url
        })
        if(!errors.isEmpty()){
            const allItems =await Item.find({},"item_name").sort({ item_name:1}).exec();
            res.render("item_form",{
                title: "Update Item",
                item_list : allItems,
                error: errors.array(),
                item: item,
            });
            return;
        }
        else{
            const updatedItem = await Item.findByIdAndUpdate(req.params.id,item,{})
            res.redirect(updatedItem.url)
        }
    })
]
    

