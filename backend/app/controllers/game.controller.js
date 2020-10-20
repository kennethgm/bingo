const db = require("../models");
const Game = db.games;
const Op = db.Sequelize.Op;

// Create and Save a new Game
exports.create = (req, res) => {
    //console.log('req body', req.body);
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a Game
    const game = {
        name: req.body.name,
        startDate: req.body.startDate,
        winners: req.body.winners
    };

    // Save Game in the database
    Game.create(game)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Game."
            });
        });
};

// Retrieve all Games from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.iLike]: `%${name}%`
        }
    } : null;

    Game.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving games."
            });
        });
};

// Find a single Game with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Game.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Game with id=" + id
            });
        });
};

// Update a Game by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Game.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Game was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Game with id=" + id
            });
        });
};

// Delete a Game with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Game.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Game was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Game with id=" + id
            });
        });
};

// Delete all Games from the database.
exports.deleteAll = (req, res) => {
    Game.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({ message: `${nums} Games were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all games."
            });
        });
};

// find all published Game
exports.findAllPublished = (req, res) => {
    Game.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving games."
            });
        });
};