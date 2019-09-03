

const db = require("../../data/db");

const findPosts = async (req, res) => {
    try{
        const posts = await db.find();
        res.json({error: false, posts: posts})
    }
    catch(errors){
        res.status(500).json({error: true, message: "The posts information could not be retrieved." })
    }
}

module.exports = findPosts