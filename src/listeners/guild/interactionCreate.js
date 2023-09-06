const Discord = require("discord.js");
const config = require("../../config.json");
const Sentry = require("@sentry/node");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.guild) {
      if (interaction.isCommand()) {
        return interaction.reply({
          content: `Commands cannot be used in Direct Messages!`,
          ephemeral: true,
        });
      }
    }

    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
        const id = Sentry.captureException(error);

        const errorLog = new Discord.EmbedBuilder()
          .setColor(config.embedColors.deny)
          .setAuthor({
            name: "Command Error",
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            `> ${config.emojis.deny} An error occurred in **${interaction.guild.name}** performed by **${interaction.user.tag}**.\n> [**Sentry Report**](https://sentry.io/${id})`
          )
          .addFields(
            { name: "Error ID", value: `> \`${id}\``, inline: true },
            {
              name: "Command",
              value: `> \`${interaction.commandName}\``,
              inline: true,
            },
            { name: "Error Message", value: `> \`${error.message}\`` }
          )
          .setTimestamp();

        const webhookClient = new Discord.WebhookClient({
          url: "WEBHOOK_URL_HERE",
        });

        webhookClient.send({ embeds: [errorLog] });

        const errorEmbed = new Discord.EmbedBuilder()
          .setColor(config.embedColors.deny)
          .setDescription(
            `> ${config.emojis.deny} **Oops! Something went wrong.**\n> Error ID: \`${id}\`\n> Please include this ID when reporting this bug in our [support server](https://discord.gg/QuYvyZGt2j), along with a description of what you were doing when the error occurred.`
          );

        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
      }
    }
  },
};
