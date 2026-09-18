import "dotenv/config";

import {
  REST,
  Routes
} from "discord.js";

import {
  commands
} from "./commands.js";

if (
  !process.env.DISCORD_TOKEN ||
  !process.env.CLIENT_ID ||
  !process.env.GUILD_ID
) {
  throw new Error(
    "DISCORD_TOKEN, CLIENT_ID et GUILD_ID sont requis."
  );
}

const rest =
  new REST({
    version: "10"
  }).setToken(
    process.env.DISCORD_TOKEN
  );

await rest.put(
  Routes.applicationGuildCommands(
    process.env.CLIENT_ID,
    process.env.GUILD_ID
  ),
  {
    body: commands
  }
);

console.log(
  `✅ ${commands.length} commandes déployées.`
)
