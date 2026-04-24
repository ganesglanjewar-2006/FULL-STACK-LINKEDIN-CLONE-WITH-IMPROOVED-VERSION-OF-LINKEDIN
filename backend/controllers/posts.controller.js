import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

//use laws of uiux in frontedn to manupulate the peoples to use it ,logo ke stha  khel skte hai ,hum frontend  dimmak vise tagda bana skte hai
import bcrypt from "bcrypt";
import crypto from "crypto";

export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "RUNNING" });
};

export const createPost = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = new Post({
      userId: user._id,
      body: req.body.body,
      media: req.file != undefined ? req.file.filename : "",
      fileType: req.file != undefined ? req.file.mimetype.split("/")[0] : "",
    });

    console.log("Saving post:", post);
    await post.save();
    return res
      .status(200)
      .json({ message: "Post created successfully", post: post });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message }); // flaging karo jab bhi kisiko hatana ho to bus  (active=false) sab rahega sirf vo dikega nhi  to ye deleting flags hai ,flag hi istemal kijiye,vo pura delete nhi hota hust for sake
  }
};

export const deletePost = async (req, res) => {
  const { token, postId } = req.body; //kab bhi delet karo to dekho kya vhi insan hai jiski id hai tab hi mouka do

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      //check krr rhe hai ki kya vo vhi hai agr hoga to access denge vrna nhi,,ckeck laga krr chalo vrna  fatt jayegi

      return res.status(401).json({
        message: "You are not authorized to delete this post,Unauthorized",
      });
    }
    await Post.deleteOne({ _id: postId }); //ekk to (active=false )krdo ya to fir assa delete ka function banao
    return res.json({ message: "Post deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const commentPost = async (req, res) => {
  const { token, postId, commentBody } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userId: user._id,
      postId: postId,
      body: commentBody,
    });

    await comment.save();
    return res
      .status(200)
      .json({ message: "Comment Added successfully", comment: comment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const get_comments_by_post = async (req, res) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId: postId }).populate(
      "userId",
      "name username profilePicture",
    );
    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const delete_comment_of_user = async (req, res) => {
  const { token, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = await Comment.findOne({ _id: comment_id });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.userId.toString() !== user._id.toString()) {
      return res.status(401).json({
        message: "You are not authorized to delete this comment,Unauthrized",
      });
    }

    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const increment_likes = async (req, res) => {
  const { postId } = req.body;

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.likes++;
    await post.save();
    return res.json({ message: "Likes incremented successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
