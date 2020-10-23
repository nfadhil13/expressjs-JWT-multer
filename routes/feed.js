const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const authorize = require('../middleware/is-auth')

const router = express.Router();



// GET post/{post Id}
router.get("/post/:postId" , authorize , feedController.getPostById);


// GET /feed/posts
router.get("/posts", authorize , feedController.getPosts);

// POST /feed/post
router.post("/post", authorize , [
    body('title').trim().isLength({min : 5}),
    body('content').trim().isLength({min : 5})
], feedController.createPost);

router.put('/post/:postId', authorize ,[
    body('title').trim().isLength({min : 5}),
    body('content').trim().isLength({min : 5})
] , feedController.editPostById)

router.delete('/post/:postId' , authorize , feedController.detelePost)

module.exports = router;
