const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();
const {
    ensureAuth,
    ensureGuest
} = require("../helpers/auth");

// Sories Index
router.get("/", (req, res) => {
    res.render("stories/stories");
});

// Add Story Form
router.get("/add", ensureAuth, (req, res) => {
    res.render("stories/add");
});

router.post("/", (req, res, next) => {
    let allowcomments;

    if (req.body.allowComments) {
        allowcomments = true;
    } else {
        allowcomments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

module.exports = router;