const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");

/// item ROUTES ///

// GET catalog home page.
router.get("/", item_controller.index);

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all item items.
router.get("/items", item_controller.item_list);


module.exports = router;
