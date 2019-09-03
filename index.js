const express = require("express");
const morgan =  require("morgan");
const postsRouter = require("./resources/posts/postsRouter");

const app = express();
const PORT = 9000;
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use("/api/", postsRouter)

app.listen(PORT, () => {
    console.log(`--Server is listening on ${PORT}`)
})