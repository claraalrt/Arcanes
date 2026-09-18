import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Events,
  ActivityType
} from "discord.js";

import {
  handleCommand,
  handleComponent
} from "./commands.js";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN manquant.");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ]
});

client.once(Events.ClientReady, (bot) => {
  console.log(`🪄 Arcanis connecté : ${bot.user.tag}`);

  bot.user.setActivity("Academia Arcanum", {
    type: ActivityType.Playing
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleCommand(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      await handleComponent(interaction);
    }
  } catch (error) {
    console.error(error);

    const message = {
      content:
        "❌ Une erreur est survenue. Vérifie les permissions du bot.",
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(message).catch(() => {});
    } else {
      await interaction.reply(message).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
