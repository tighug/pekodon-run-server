const { SlashCommandBuilder } = require("discord.js");
const { spawnSync } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("サーバーの状態を確認します。"),
  execute: async (interaction) => {
    let serverStatus = "";
    let memoryStatus = "";
    const { stdout, stderr } = spawnSync("systemctl", [
      "is-active",
      "palworld-server.service",
    ]);
    serverStatus = stdout.toString("UTF-8") + stderr.toString("UTF-8");
    memoryStatus = spawnSync("free", ["-h"]).stdout;
    const serverStatusStr = serverStatus.includes("inactive")
      ? "停止中"
      : "起動中";
    const memoryStatusStr = "```\n" + memoryStatus + "```";
    await interaction.reply(
      `起動状況： ${serverStatusStr}\n\nメモリ使用量：${memoryStatusStr}`
    );
  },
};
