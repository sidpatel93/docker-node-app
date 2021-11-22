const express = require('express');
const mongoose = require('mongoose');
const sessions = require('express-session');
const redis = require('redis');
const cors = require('cors')
let RedisStore = require("connect-redis")(sessions)
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_IP, REDIS_PORT, SESSION_SECRET } = require('./config/config');
let redisClient = redis.createClient({
  host: REDIS_IP,
  port: REDIS_PORT
})
const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userroutes')

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const port = process.env.PORT || 3000;

app.enable("trust proxy");
app.use(cors());
app.use(sessions({
  store: new RedisStore({client: redisClient}),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialize: false,
    httpOnly: true,
    maxAge: 1800000
  }
}))

app.use(express.json())
// DB Connection
mongoose.connect(mongoURL)
.then(()=>{
  console.log("successfully connected to DB!!")
})
.catch((err)=> {
  console.log("there was a error")
})

// Root URL
app.get("/api/v1", (req,res)=>{
  
  console.log("it ran")
  res.send("<h2>Hello there, this is from dockerhub image !</h2>");
})

//This will redirect the requres to postRoute if the path is /api/v1/posts
app.use("/api/v1/posts", postRouter)
//This will redirect the requres to userRoute if the path is /api/v1/posts
app.use("/api/v1/users", userRouter)

app.listen(port, ()=> {
  console.log(`listening on port ${port}`)
})