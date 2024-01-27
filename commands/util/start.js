const { SlashCommandBuilder } = require("discord.js");
const { spawnSync } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("サーバーを起動します。"),
  execute: async (interaction) => {
    spawnSync("systemctl", ["restart", "palworld-server.service"]);
    await interaction.reply("サーバーを起動したペコ！");
  },
};
