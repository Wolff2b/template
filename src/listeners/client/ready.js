const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(chalk.bold.green(`[BOT] Logged in as: ${client.user.tag}`));
    console.log(chalk.bold.blue(`[BOT] User ID: ${client.user.id}`));
    console.log(chalk.bold.blue(`[BOT] Servers: ${client.guilds.cache.size}`));
    console.log(chalk.bold.blue(`[BOT] Users: ${client.users.cache.size}`));

    mongoose
      .connect(process.env.mongoose || "", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        const dbName = mongoose.connection.db.databaseName;
        console.log(
          chalk.bold.green(`[DATABASE] Connected to MongoDB: ${dbName}`)
        );
      })
      .catch((error) => {
        console.error(
          chalk.bold.red("[DATABASE] Connection Error:", error.message)
        );
      });
  },
};
