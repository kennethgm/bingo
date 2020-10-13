module.exports = app => {
    const cards = require("../controllers/card.controller.js");

    var router = require("express").Router();

    // Create a new Tutorial
    router.post("/", cards.create);

    // Retrieve all Tutorials
    router.get("/", cards.findAll);

    // Retrieve all published Tutorials
    router.get("/published", cards.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", cards.findOne);

    // Update a Tutorial with id
    router.put("/:id", cards.update);

    // Delete a Tutorial with id
    router.delete("/:id", cards.delete);

    // Create a new Tutorial
    router.delete("/", cards.deleteAll);

    app.use("/api/cards", router);
};