const { readdirSync } = require("fs");

function loadMessage(client) {
  readdirSync("./src/commands/message").forEach((dir) => {
    const commands = readdirSync(`./src/commands/message/${dir}/`).filter(
      (file) => file.endsWith(".js")
    );
    for (let file of commands) {
      let pull = require(`../commands/message/${dir}/${file}`);
      if (pull.name) {
        client.messageCommands.set(pull.name, pull);
      } else {
        continue;
      }
    }
  });
}

module.exports = { loadMessage };
