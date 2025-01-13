const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Hoot = require('../models/hoot.js');
const router = express.Router();

// ========== Public Routes ===========

// ========= Protected Routes =========

// Middleware to verify the token for all routes below
router.use(verifyToken);

// Create a new hoot in database
router.post('/', async (req, res) => {
    try {
      req.body.author = req.user._id;
      const hoot = await Hoot.create(req.body);
      hoot._doc.author = req.user;
      res.status(201).json(hoot);
    } 
    catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  });

// Fetch all the hoots by time created  
router.get('/', async (req, res) => {
    try {
      const hoots = await Hoot.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(hoots);
    } 
    catch (error) {
      res.status(500).json(error);
    }
    });

// Fetch a hoot by ID and get author
router.get('/:hootId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId)
            .populate('author') // Populating author of the hoot
            .populate({
                path: 'comments',
                populate: {
                    path: 'author', // Populating author of each comment
                    select: 'username', // Select only the username field
                },
            });

        if (!hoot) {
            return res.status(404).json({ message: 'Hoot not found' });
        }

        res.status(200).json(hoot);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


// Update a specific hoot by ID 
router.put('/:hootId', async (req, res) => {
    try {
        // Find the hoot:
        const hoot = await Hoot.findById(req.params.hootId);
  
        // Authenticate:
        if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
        }
  
        // Update hoot
        const updatedHoot = await Hoot.findByIdAndUpdate(
        req.params.hootId,
        req.body,
        { new: true }
        );
        updatedHoot._doc.author = req.user;
        res.status(200).json(updatedHoot);
    } 
    catch (error) {
      res.status(500).json(error);
    }
    });

// Delete specific hoot by ID
router.delete('/:hootId', async (req, res) => {
    try {
        // Find the hoot:
        const hoot = await Hoot.findById(req.params.hootId);

        // Authenticate
        if (!hoot.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
        }
        // Delete the hoot
        const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
        res.status(200).json(deletedHoot);
    } 
    catch (error) {
        res.status(500).json(error);
    }
    });

// Add a comment to a specific hoot    
router.post('/:hootId/comments', async (req, res) => {
    try {
        req.body.author = req.user._id;
        const hoot = await Hoot.findById(req.params.hootId);
      
        // Add the new comment to the comments array
        hoot.comments.push(req.body);
        await hoot.save();
  
        // Retrieve newly added comment:
        const newComment = hoot.comments[hoot.comments.length - 1];
  
        newComment._doc.author = req.user;
  
        res.status(201).json(newComment);
    } 
    catch (error) {
        res.status(500).json(error);
    }
    });

// Update a specific comment on a hoot    
router.put('/:hootId/comments/:commentId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);
        const comment = hoot.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Update and save
        comment.text = req.body.text;
        await hoot.save();
        res.status(200).json({ message: 'Comment updated successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a specific comment from a hoot
router.delete('/:hootId/comments/:commentId', async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);
        hoot.comments.remove({ _id: req.params.commentId });
        await hoot.save();
        res.status(200).json({ message: 'Ok' });
    } 
    catch (err) {
      res.status(500).json(err);
    }
    });

module.exports = router;
