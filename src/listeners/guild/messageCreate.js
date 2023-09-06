const config = require("../../config.json");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    const prefix = config.prefix;

    const [cmd, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);

    const command =
      client.messageCommands.get(cmd.toLowerCase()) ||
      client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

    if (!command) return;

    await command.run(client, message, args);
  },
};
