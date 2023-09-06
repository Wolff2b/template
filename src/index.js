const {
    Client,
    GatewayIntentBits,
    Collection,
    Partials,
    WebhookClient,
    EmbedBuilder,
  } = require("discord.js");
  require("dotenv").config();
  require("colors");
  
  const Sentry = require("@sentry/node");
  const config = require("./config.json");
  
  const { loadCommands } = require("./functions/handleSlash");
  const { loadEvents } = require("./functions/handleEvents");
  const { loadMessage } = require("./functions/handleMessage");
  
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.DirectMessageReactions,
      GatewayIntentBits.DirectMessages,
    ],
  
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });
  
  Sentry.init({
    dsn: process.env.sentry_dsn,
    tracesSampleRate: 1.0,
  });
  
  const webhookClient = new WebhookClient({
    url: "WEBHOOK_URL",
  });
  
  process.on("unhandledRejection", (error) => {
    console.log(error)
    Sentry.captureException(error);
    errorLog(error);
  });
  
  process.on("uncaughtException", (error) => {
    console.log(error)
    Sentry.captureException(error);
    errorLog(error);
  });
  
  process.on("uncaughtExceptionMonitor", (error) => {
    console.log(error)
    Sentry.captureException(error);
    errorLog(error);
  });
  
  process.on("exit", (error) => {
    console.log(error)
    Sentry.captureException(error);
    errorLog(error);
  });
  
  client.on("error", (error) => {
    console.log(error)
    Sentry.captureException(error);
    errorLog(error);
  });
  
  client.on("listenerError", (error) => {
    console.log(error)
    Sentry.captureException(error);
    errorLog(error);
  });
  
  client.commands = new Collection();
  client.slashCommands = new Collection();
  client.messageCommands = new Collection();
  
  client.login(process.env.token).then(() => {
    loadMessage(client);
    loadCommands(client);
    loadEvents(client);
  });
  
  async function errorLog(error) {
    const id = Sentry.captureException(error);
  
    const errorLog = new EmbedBuilder()
      .setColor(config.embedColors.deny)
      .setAuthor({ name: "Listener Error", iconURL: client.user.displayAvatarURL() })
      .setDescription(
        `> ${config.emojis.deny} An error occurred in a listener.\n> [**Sentry Report**](https://sentry.io/${id})`
      )
      .addFields(
        { name: "Error ID", value: `> \`${id}\`` },
        { name: "Error Message", value: `> \`${error.message}\`` }
      )
      .setTimestamp();
  
    webhookClient.send({
      embeds: [errorLog],
    });
  }
  