require('dotenv/config');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

var corsOptions = { origin: "http://localhost:8780/" };

app.use(cors()).use(bodyParser.json()).use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

db.mongoose.connect(process.env.URI_MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Successfully connect to MongoDB.");
  initial();
}).catch(err => {
  console.error("Connection error", err);
  process.exit();
});

app.get("/", (req, res) => { res.json({ message: "Welcome to home-finances-server." }); });

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}.`); });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({ name: "user" }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });

      new Role({ name: "moderator" }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'moderator' to roles collection");
      });

      new Role({ name: "admin" }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}