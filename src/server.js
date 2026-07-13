const app = require("./app");
const sequelize = require("./config/database");
const Contact = require("./models/Contact"); // Import the model

require("dotenv").config();

const PORT = process.env.PORT || 3000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database Connected");
    console.log("Contacts table created/synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));