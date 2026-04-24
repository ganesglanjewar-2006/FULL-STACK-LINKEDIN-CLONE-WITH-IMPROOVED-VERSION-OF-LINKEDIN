//jab bhi hume exxistig data prr kam krna ho to hum  usse koi ched chad nhi karenge hum ekk naya krke ussse connect karemge 
//hum yaha yhi krr rhe hai kyuki ye ekk practic hai
//aur hume ye practise use krte rhne hai
//yaha hum comments post me dal skte the liekin hum alg se isko connect karemge aur bhejnege


//asse hum connect krrte hai  bahar ka daata ander ya fuctionality ko add krte hai
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",

    },
    body: {
        type: String,
        required: true,
    }
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;