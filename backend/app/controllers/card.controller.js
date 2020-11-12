const db = require("../models");
const Card = db.cards;
const Op = db.Sequelize.Op;
require('dotenv').config();
const AWS = require('aws-sdk');
const mailcomposer = require('mailcomposer');

// Amazon SES configuration
const SESConfig = {
    apiVersion: '2010-12-01',
    accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    region: process.env.AWS_SES_REGION
};

// Create and Save a new Card
exports.create = (req, res) => {
    //console.log('req body', req.body);
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }


    // Create a Card
    const card = {
        name: req.body.name,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        numbers: req.body.numbers,
        gameCode: req.body.gameCode,
        officialId: req.body.officialId
    };

    // Save Card in the database
    Card.create(card)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Card."
            });
        });
};

// Retrieve all Cards from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? {
        name: {
            [Op.iLike]: `%${name}%`
        }
    } : null;

    Card.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving cards."
            });
        });
};

// Find a single Card with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Card.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Card with id=" + id
            });
        });
};

// Update a Card by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;

    Card.update(req.body, {
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Card was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Card with id=${id}. Maybe Card was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Card with id=" + id
            });
        });
};

// Delete a Card with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Card.destroy({
            where: { id: id }
        })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Card was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Card with id=${id}. Maybe Card was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Card with id=" + id
            });
        });
};

// Delete all Cards from the database.
exports.deleteAll = (req, res) => {
    Card.destroy({
            where: {},
            truncate: false
        })
        .then(nums => {
            res.send({ message: `${nums} Cards were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all cards."
            });
        });
};

// find all published Card
exports.findAllPublished = (req, res) => {
    Card.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving cards."
            });
        });
};

exports.findWithGameCode = (req, res) => {
    let code = (req.body.code).toString();
    Card.findAll({
            where: {
                gameCode: code
            }
        }).then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving cards."
            });
        });
};

exports.sendEmail = (req, res1) => {
    let emailTo = (req.body.emailTo).toString();
    let message = (req.body.message).toString();
    let subject = (req.body.subject).toString();
    let path = (req.body.path).toString();

    const mail = mailcomposer({
        from: 'zenproduc01@gmail.com',
        replyTo: 'zenproduc01@gmail.com',
        to: emailTo,
        subject: subject,
        text: message,
        attachments: [{
            path: path
        }, ],
    });


    mail.build((err, message) => {
        if (err) {
            reject(`Error generating raw email: ${err}`);
        }

        new AWS.SES(SESConfig).sendRawEmail({ RawMessage: { Data: message } }).promise().then((res) => {
            console.log('res', res);
            res1.send(res);
        }).catch((error) => {
            console.log('error', error);
            res1.status(500).send({
                message: error.message || "Error sending email."
            });
        });
    });



};