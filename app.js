const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const feedRoutes = require("./routes/feed");
const userRoutes = require('./routes/auth');

const sequelize = require("./util/database");

const multer = require("multer");

const { v4: uuidv4 } = require("uuid");

const Post = require("./model/post");
const User = require("./model/user");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/postImages");
  },
  filename: (req, file, cb) => {
    const fileExtension = "." + file.mimetype.toString().split("/")[1];
    cb(null, uuidv4() + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use(
  "/images/postImages",
  express.static(path.join(__dirname, "images", "postImages"))
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);
app.use("/user" , userRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const cause = error.cause || "Unknown";
  res.status(status).json({
    message: message,
    error: status,
    cause: cause,
  });
});

User.hasMany(Post, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey : {
      allowNull : false
  }
});

Post.belongsTo(User , {
    constraints: true
})

const init = async () => {
  try {
    await sequelize.sync();
    app.listen(process.env.PORT || 8182);
  } catch (err) {
    console.log(err);
  }
};

init();
