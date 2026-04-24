import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import Post from "../models/posts.model.js";

const convertUserDataToPDF = async (userData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";
            const stream = fs.createWriteStream("uploads/" + outputPath);

            doc.pipe(stream);
            
            // Check if profile picture exists before adding to PDF
            if (userData.userId && userData.userId.profilePicture) {
                const imgPath = `uploads/${userData.userId.profilePicture}`;
                if (fs.existsSync(imgPath)) {
                    doc.image(imgPath, { align: "center", width: 100 });
                }
            }

            doc.fontSize(20).text("Resume", { align: "center" });
            doc.moveDown();
            doc.fontSize(14).text(`Name: ${userData.userId?.name || "N/A"}`);
            doc.fontSize(14).text(`Username: ${userData.userId?.username || "N/A"}`);
            doc.fontSize(14).text(`Email: ${userData.userId?.email || "N/A"}`);
            doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
            doc.fontSize(14).text(`Current Position: ${userData.curentPost || "N/A"}`);

            doc.moveDown();
            doc.fontSize(16).text(`Work History:`);
            
            const workList = userData.pastWork || [];
            workList.forEach((work, index) => {
                doc.fontSize(12).text(`${index + 1}. ${work.company} - ${work.position} (${work.years})`);
            });

            doc.end();
            stream.on("finish", () => resolve(outputPath));
            stream.on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
}


export const register = async (req, res) => {
    try {

        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, username });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });

        await profile.save();

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = crypto.randomBytes(64).toString("hex");  //token use for authentication and authorization asa wel as to find the user and remove the friction of login again and again
        // abhu hamesha token hi use karo practise me
        await User.updateOne({ _id: user._id }, { token })
        return res.json({ token: token });



    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({ message: "Profile Picture Updated" })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



export const updateUserProfile = async (req, res) => {

    try {
        const { token, ...newUserData } = req.body;  //(...)spread operator barr barr info na dalna pade isliye use krte hai 
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const { username, email } = newUserData;

        if (username || email) {
            const query = [];
            if (username) query.push({ username });
            if (email) query.push({ email });

            const existingUser = await User.findOne({ $or: query });

            if (existingUser && String(existingUser._id) !== String(user._id)) {
                return res.status(400).json({ message: "User already exists" });
            }
        }

        Object.assign(user, newUserData); //easy way to wote hai  vrn hum ekk ekk likha pdta user.name=name,user.email=email like a consturctor me likte hai vaise isne hamare kam assan kr diye
        await user.save();

        return res.json({ message: "User Updated" });

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }
}


export const getUserAndProfile = async (req, res) => {

    try {
        const { token } = req.query;  // repeat ho rha hai token bohot to abhi hum middleware use karenge

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture');

        return res.json(userProfile);



    } catch (error) {
        return res.status(500).json({ message: error.message });

    }


}

export const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.query;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ userId: user._id })
            .populate("userId", "name username email profilePicture");

        return res.json({ profile });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const updateProfileData = async (req, res) => {

    try {
        const { token, ...newProfileData } = req.body;

        // First find the user by token
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Then find and update the profile by userId
        const profile_to_update = await Profile.findOne({ userId: user._id });

        if (!profile_to_update) {
            return res.status(404).json({ message: "Profile not found" });
        }

        Object.assign(profile_to_update, newProfileData);

        await profile_to_update.save();

        return res.json({ message: "Profile Updated" });

    } catch (error) {

        return res.status(500).json({ message: error.message });

    }

}



export const getAllUserProfile = async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('userId', 'name username email profilePicture');

        const filteredProfiles = profiles.filter(profile => profile.userId !== null);

        return res.json(filteredProfiles);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


export const downloadResumeProfile = async (req, res) => {
    try {
        const user_id = req.query.user_id;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const userProfile = await Profile.findOne({ userId: user_id })
            .populate('userId', 'name username email profilePicture');

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let outputPath = await convertUserDataToPDF(userProfile);

        return res.json({ message: outputPath });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const sendConnectionRequest = async (req, res) => {

    const { token, connectionId } = req.body;


    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });



        if (!connectionUser) {
            return res.status(404).json({ message: "Connection User not found" });
        }


        const existingRequest = await ConnectionRequest.findOne({ userId: user._id, connectionId: connectionUser._id });

        if (existingRequest) {
            return res.status(400).json({ message: "Connection Request already exists" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id,

        })

        await request.save();

        return res.json({ message: "Connection Request Sent" });


    } catch (error) {
        return res.status(500).json({ message: error.message });

    }

}

export const getMyConnectionsRequest = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate('connectionId', 'name username email profilePicture');

        return res.json(connections);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const whatAreMyConnections = async (req, res) => {
    const { token } = req.body;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate('userId', 'name username email profilePicture');

        return res.json(connections);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



export const acceptConnectionRequest = async (req, res) => {
    const { token, requestId, action_type } = req.body;

    try {

        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId });

        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        if (action_type === 'accept') {
            connection.status_accepted = true;

        } else {
            connection.status_accepted = false;

        }


        await connection.save();

        return res.json({ message: "Connection request updated successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
    const { username } = req.query;

    try {
        const user = await User.findOne({
            username
        })

        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', "name username email profilePicture");

        return res.json({ "profile": userProfile })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}