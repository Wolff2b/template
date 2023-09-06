module.exports = {
  name: "ping",
  description: "Retrieve the ping of the bot.",

  async run(client, message, args) {
    message.reply(`Pong! ${client.ws.ping}ms`);
  },
};
