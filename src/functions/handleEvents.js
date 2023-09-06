function loadEvents(client) {
    const ascii = require("ascii-table");
    const fs = require("fs");
    const chalk = require("chalk");
    const table = new ascii().setHeading("Listeners", "Status");
  
    const folders = fs.readdirSync("./src/listeners");
  
    for (const folder of folders) {
      const files = fs
        .readdirSync(`./src/listeners/${folder}`)
        .filter((file) => file.endsWith(".js"));
  
      for (const file of files) {
        const event = require(`../listeners/${folder}/${file}`);
        if (event.rest) {
          if (event.once)
            client.rest.once(event.name, (...args) =>
              event.execute(...args, client)
            );
          else
            client.rest.on(event.name, (...args) =>
              event.execute(...args, client)
            );
        } else {
          if (event.once)
            client.once(event.name, (...args) => event.execute(...args, client));
          else client.on(event.name, (...args) => event.execute(...args, client));
        }
        table.addRow(file, "Loaded");
        continue;
      }
    }
    return console.log(chalk.bold.whiteBright(table.toString()));
  }
  
  module.exports = { loadEvents };
  