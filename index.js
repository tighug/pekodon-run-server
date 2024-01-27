const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
require("dotenv").config();
const TOKEN = process.env.TOKEN;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`${interaction.commandName}はわからないペコ...`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "コマンド実行時にエラーになったペコ。",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "コマンド実行時にエラーになったペコ。",
        ephemeral: true,
      });
    }
  }
});

client.login(TOKEN);
