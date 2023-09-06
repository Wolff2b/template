const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDMPermission(false)
    .setDescription("Retrieve the ping of the bot."),

  async execute(interaction, client) {

    interaction.reply(`Pong! ${client.ws.ping}ms`)
  },
};
