import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} from "discord.js";

import {
  db,
  getUser,
  saveCharacter,
  addXP,
  addGallions,
  addHousePoints,
  getHousePoints,
  addItem,
  getInventory
} from "./db.js";

export const houses = {
  Valdoria: {
    emoji: "🦁",
    motto: "La bravoure forge les légendes."
  },

  Nocteris: {
    emoji: "🐍",
    motto: "La volonté ne connaît aucune limite."
  },

  Aurelune: {
    emoji: "🦅",
    motto: "La connaissance éclaire le chemin."
  },

  Eldoria: {
    emoji: "🦌",
    motto: "Unis par l'honneur, forts par le cœur."
  }
};

const spells = [
  "Lumos",
  "Nox",
  "Accio",
  "Alohomora",
  "Wingardium Leviosa",
  "Reparo",
  "Protego",
  "Expelliarmus",
  "Incendio",
  "Aguamenti",
  "Finite",
  "Riddikulus",
  "Flipendo",
  "Impedimenta",
  "Stupefix",
  "Expecto Patronum",
  "Depulso",
  "Diffindo",
  "Arresto Momentum"
];

const shopItems = [
  ["Livre de magie", 5],
  ["Potion de soin", 10],
  ["Plume enchantée", 8],
  ["Animal magique", 30],
  ["Baguette", 50],
  ["Balai d'entraînement", 100]
];

const missions = [
  ["E", "Retrouver un livre disparu", 10, 20],
  ["D", "Escorter un élève", 25, 50],
  ["C", "Enquête dans les archives", 50, 100],
  ["B", "Expédition dans la forêt", 75, 150],
  ["A", "Mystère du Cœur des Fondateurs", 100, 250]
];

export const commands = [

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Installe Academia Arcanum")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  new SlashCommandBuilder()
    .setName("repartition")
    .setDescription("Commence la répartition"),

  new SlashCommandBuilder()
    .setName("profil")
    .setDescription("Affiche ton profil"),

  new SlashCommandBuilder()
    .setName("personnage")
    .setDescription("Gestion du personnage")

    .addSubcommand(sub =>
      sub
        .setName("creer")
        .setDescription("Crée ton personnage")

        .addStringOption(option =>
          option
            .setName("nom")
            .setDescription("Nom du personnage")
            .setRequired(true)
        )

        .addIntegerOption(option =>
          option
            .setName("age")
            .setDescription("Âge")
            .setRequired(true)
            .setMinValue(10)
            .setMaxValue(100)
        )

        .addIntegerOption(option =>
          option
            .setName("annee")
            .setDescription("Année scolaire")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(7)
        )

        .addStringOption(option =>
          option
            .setName("origine")
            .setDescription("Origine magique")
            .setRequired(true)
        )

        .addStringOption(option =>
          option
            .setName("qualites")
            .setDescription("Qualités")
            .setRequired(true)
        )

        .addStringOption(option =>
          option
            .setName("defauts")
            .setDescription("Défauts")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName("voir")
        .setDescription("Affiche ton personnage")
    ),

  new SlashCommandBuilder()
    .setName("maison")
    .setDescription("Affiche ta maison"),

  new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Affiche ou ajoute de l'XP")

    .addIntegerOption(option =>
      option
        .setName("montant")
        .setDescription("XP à ajouter")
        .setMinValue(0)
    ),

  new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Affiche tes statistiques"),

  new SlashCommandBuilder()
    .setName("points")
    .setDescription("Gestion des points")

    .addSubcommand(sub =>
      sub
        .setName("classement")
        .setDescription("Classement des maisons")
    )

    .addSubcommand(sub =>
      sub
        .setName("ajouter")
        .setDescription("Ajoute des points")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild
        )

        .addStringOption(option =>
          option
            .setName("maison")
            .setDescription("Maison")
            .setRequired(true)
            .addChoices(
              { name: "🦁 Valdoria", value: "Valdoria" },
              { name: "🐍 Nocteris", value: "Nocteris" },
              { name: "🦅 Aurelune", value: "Aurelune" },
              { name: "🦌 Eldoria", value: "Eldoria" }
            )
        )

        .addIntegerOption(option =>
          option
            .setName("montant")
            .setDescription("Nombre de points")
            .setRequired(true)
            .setMinValue(1)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName("retirer")
        .setDescription("Retire des points")
        .setDefaultMemberPermissions(
          PermissionFlagsBits.ManageGuild
        )

        .addStringOption(option =>
          option
            .setName("maison")
            .setDescription("Maison")
            .setRequired(true)
            .addChoices(
              { name: "🦁 Valdoria", value: "Valdoria" },
              { name: "🐍 Nocteris", value: "Nocteris" },
              { name: "🦅 Aurelune", value: "Aurelune" },
              { name: "🦌 Eldoria", value: "Eldoria" }
            )
        )

        .addIntegerOption(option =>
          option
            .setName("montant")
            .setDescription("Nombre de points")
            .setRequired(true)
            .setMinValue(1)
        )
    ),

  new SlashCommandBuilder()
    .setName("sorts")
    .setDescription("Liste les sorts"),

  new SlashCommandBuilder()
    .setName("apprendre")
    .setDescription("Apprends un sort")

    .addStringOption(option =>
      option
        .setName("sort")
        .setDescription("Sort à apprendre")
        .setRequired(true)
        .addChoices(
          ...spells.map(spell => ({
            name: spell,
            value: spell
          }))
        )
    ),

  new SlashCommandBuilder()
    .setName("missions")
    .setDescription("Liste les missions"),

  new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Affiche tes Gallions"),

  new SlashCommandBuilder()
    .setName("payer")
    .setDescription("Donne des Gallions")

    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription("Destinataire")
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName("montant")
        .setDescription("Montant")
        .setRequired(true)
        .setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName("boutique")
    .setDescription("Affiche la boutique"),

  new SlashCommandBuilder()
    .setName("acheter")
    .setDescription("Achète un objet")

    .addStringOption(option =>
      option
        .setName("objet")
        .setDescription("Objet")
        .setRequired(true)
        .addChoices(
          ...shopItems.map(([name]) => ({
            name,
            value: name
          }))
        )
    ),

  new SlashCommandBuilder()
    .setName("inventaire")
    .setDescription("Affiche ton inventaire"),

  new SlashCommandBuilder()
    .setName("duel")
    .setDescription("Défie un joueur")

    .addUserOption(option =>
      option
        .setName("adversaire")
        .setDescription("Adversaire")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("quidditch")
    .setDescription("Informations Quidditch")

    .addSubcommand(sub =>
      sub
        .setName("regles")
        .setDescription("Affiche les règles")
    )

    .addSubcommand(sub =>
      sub
        .setName("equipes")
        .setDescription("Affiche les équipes")
    ),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Crée un ticket"),

  new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Avertit un membre")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ModerateMembers
    )

    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("raison")
        .setDescription("Raison")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Supprime des messages")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageMessages
    )

    .addIntegerOption(option =>
      option
        .setName("nombre")
        .setDescription("Nombre de messages")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulse un membre")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.KickMembers
    )

    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("raison")
        .setDescription("Raison")
    ),

  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bannit un membre")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.BanMembers
    )

    .addUserOption(option =>
      option
        .setName("membre")
        .setDescription("Membre")
        .setRequired(true)
    )

    .addStringOption(option =>
      option
        .setName("raison")
        .setDescription("Raison")
    )

].map(command => command.toJSON());


export async function handleCommand(interaction) {

  const guildId = interaction.guild?.id;
  const userId = interaction.user.id;

  if (!guildId) {
    return interaction.reply({
      content: "Cette commande doit être utilisée sur un serveur.",
      ephemeral: true
    });
  }

  getUser(guildId, userId);

  switch (interaction.commandName) {

    case "setup":
      return setup(interaction);

    case "repartition":
      return repartition(interaction);

    case "profil":
      return profile(interaction);

    case "personnage":
      return character(interaction);

    case "maison":
      return house(interaction);

    case "xp":
      return xpCommand(interaction);

    case "stats":
      return stats(interaction);

    case "points":
      return points(interaction);

    case "sorts":
      return spellsCommand(interaction);

    case "apprendre":
      return learn(interaction);

    case "missions":
      return missionsCommand(interaction);

    case "balance":
      return balance(interaction);

    case "payer":
      return pay(interaction);

    case "boutique":
      return shop(interaction);

    case "acheter":
      return buy(interaction);

    case "inventaire":
      return inventoryCommand(interaction);

    case "duel":
      return duel(interaction);

    case "quidditch":
      return quidditch(interaction);

    case "ticket":
      return ticket(interaction);

    case "warn":
      return warn(interaction);

    case "clear":
      return clear(interaction);

    case "kick":
      return kick(interaction);

    case "ban":
      return ban(interaction);
  }
}


async function setup(interaction) {

  const guild = interaction.guild;

  await interaction.deferReply({
    ephemeral: true
  });

  const roles = [
    "👑 Fondateur",
    "🏰 Directeur",
    "🛡️ Administrateur",
    "🔨 Modérateur",
    "🎭 Maître du Jeu",
    "👨‍🏫 Professeur",
    "⭐ Préfet",
    "🦁 Valdoria",
    "🐍 Nocteris",
    "🦅 Aurelune",
    "🦌 Eldoria",
    "1️⃣ Année",
    "2️⃣ Année",
    "3️⃣ Année",
    "4️⃣ Année",
    "5️⃣ Année",
    "6️⃣ Année",
    "7️⃣ Année"
  ];

  for (const roleName of roles) {

    const exists =
      guild.roles.cache.find(
        role => role.name === roleName
      );

    if (!exists) {
      await guild.roles.create({
        name: roleName
      });
    }
  }

  const categories = [

    [
      "🏰 ACCUEIL",
      [
        "👋・bienvenue",
        "📜・règlement",
        "📢・annonces",
        "📕・guide-du-serveur",
        "❓・questions"
      ]
    ],

    [
      "🎩 INSCRIPTION",
      [
        "📝・présentation",
        "📋・fiche-personnage",
        "🎩・répartition",
        "📜・registre-des-élèves"
      ]
    ],

    [
      "🏫 ACADÉMIE",
      [
        "🏛️・hall-dentrée",
        "🍽️・grande-salle",
        "📚・bibliothèque",
        "🏥・infirmerie",
        "🌙・tour-dastronomie"
      ]
    ],

    [
      "📚 ENSEIGNEMENT",
      [
        "🪄・sortilèges",
        "🛡️・défense-magique",
        "🧪・potions",
        "🦋・métamorphose",
        "🌿・botanique",
        "🐉・créatures-magiques",
        "📜・histoire-magique"
      ]
    ],

    [
      "⚔️ AVENTURES",
      [
        "🎭・scènes-rp",
        "⚔️・duels",
        "📜・missions",
        "🕵️・enquêtes",
        "🌲・forêt-interdite"
      ]
    ],

    [
      "🧹 QUIDDITCH",
      [
        "🏟️・terrain",
        "📋・équipes",
        "🏆・championnat"
      ]
    ],

    [
      "💰 ÉCONOMIE",
      [
        "💰・mon-portefeuille",
        "🎒・inventaire",
        "🛒・boutique",
        "💎・objets-rares"
      ]
    ],

    [
      "🎓 VIE ÉTUDIANTE",
      [
        "💬・discussion",
        "🎮・hors-rp",
        "🎉・événements",
        "💌・courrier"
      ]
    ],

    [
      "🔒 STAFF",
      [
        "💬・staff",
        "📋・tickets",
        "🚨・sanctions",
        "📊・logs"
      ]
    ]

  ];

  for (const [categoryName, channels] of categories) {

    let category =
      guild.channels.cache.find(
        channel =>
          channel.name === categoryName &&
          channel.type === 4
      );

    if (!category) {

      category =
        await guild.channels.create({
          name: categoryName,
          type: 4
        });

    }

    for (const channelName of channels) {

      const exists =
        guild.channels.cache.find(
          channel =>
            channel.name === channelName
        );

      if (!exists) {

        await guild.channels.create({
          name: channelName,
          type: 0,
          parent: category.id
        });

      }

    }
  }

  db.prepare(`
    INSERT INTO config
    (guild_id, setup_done)
    VALUES (?, 1)

    ON CONFLICT(guild_id)
    DO UPDATE SET setup_done = 1
  `).run(guild.id);

  return interaction.editReply(
    "✅ **Arcanis est installé !**\n\n" +
    "🏰 Les catégories ont été créées.\n" +
    "🎩 Les rôles ont été créés.\n" +
    "📚 Les salons principaux ont été créés.\n\n" +
    "Bienvenue à **Academia Arcanum** ! 🪄"
  );
}


async function repartition(interaction) {

  const menu =
    new StringSelectMenuBuilder()
      .setCustomId(
        `sorting:${interaction.user.id}`
      )
      .setPlaceholder(
        "Choisis la réponse qui te correspond"
      )

      .addOptions(
        {
          label: "Je protège les autres",
          value: "Valdoria",
          emoji: "🦁"
        },
        {
          label: "Je cherche la connaissance",
          value: "Aurelune",
          emoji: "🦅"
        },
        {
          label: "Je poursuis mes objectifs",
          value: "Nocteris",
          emoji: "🐍"
        },
        {
          label: "Je protège ceux que j'aime",
          value: "Eldoria",
          emoji: "🦌"
        }
      );

  const row =
    new ActionRowBuilder()
      .addComponents(menu);

  return interaction.reply({
    content:
      "🎩 **CRISTAL DES FONDATEURS**\n\n" +
      "Le cristal observe ton caractère.\n\n" +
      "**Quelle qualité te représente le mieux ?**",
    components: [row],
    ephemeral: true
  });
}


async function profile(interaction) {

  const user =
    getUser(
      interaction.guild.id,
      interaction.user.id
    );

  const character =
    user.character_json
      ? JSON.parse(user.character_json)
      : null;

  const house =
    user.house
      ? `${houses[user.house].emoji} ${user.house}`
      : "Aucune";

  const embed =
    new EmbedBuilder()
      .setTitle(
        `📜 Profil de ${interaction.user.displayName}`
      )
      .addFields(
        {
          name: "Maison",
          value: house,
          inline: true
        },
        {
          name: "Niveau",
          value: String(user.level),
          inline: true
        },
        {
          name: "XP",
          value: String(user.xp),
          inline: true
        },
        {
          name: "💰 Gallions",
          value: String(user.gallions),
          inline: true
        }
      );

  if (character) {

    embed.setDescription(
      `**Personnage :** ${character.nom}\n` +
      `**Âge :** ${character.age}\n` +
      `**Année :** ${character.annee}\n` +
      `**Origine :** ${character.origine}\n` +
      `**Qualités :** ${character.qualites}\n` +
      `**Défauts :** ${character.defauts}`
    );

  } else {

    embed.setDescription(
      "Aucun personnage créé.\n" +
      "Utilise `/personnage creer`."
    );

  }

  return interaction.reply({
    embeds: [embed]
  });
}


async function character(interaction) {

  const subcommand =
    interaction.options.getSubcommand();

  if (subcommand === "voir") {
    return profile(interaction);
  }

  const characterData = {

    nom:
      interaction.options.getString("nom"),

    age:
      interaction.options.getInteger("age"),

    annee:
      interaction.options.getInteger("annee"),

    origine:
      interaction.options.getString("origine"),

    qualites:
      interaction.options.getString("qualites"),

    defauts:
      interaction.options.getString("defauts")

  };

  saveCharacter(
    interaction.guild.id,
    interaction.user.id,
    characterData
  );

  return interaction.reply(
    "✅ **Personnage enregistré !**\n\n" +
    "🎩 Utilise maintenant `/repartition`."
  );
}


async function house(interaction) {

  const user =
    getUser(
      interaction.guild.id,
      interaction.user.id
    );

  if (!user.house) {

    return interaction.reply(
      "🎩 Tu n'as pas encore de maison.\n" +
      "Utilise `/repartition`."
    );

  }

  return interaction.reply(
    `${houses[user.house].emoji} **${user.house}**\n` +
    `_${houses[user.house].motto}_`
  );
}


async function xpCommand(interaction) {

  const amount =
    interaction.options.getInteger("montant");

  const user =
    getUser(
      interaction.guild.id,
      interaction.user.id
    );

  if (amount === null) {

    return interaction.reply(
      `⭐ Niveau **${user.level}** — **${user.xp} XP**`
    );

  }

  if (
    !interaction.member.permissions.has(
      PermissionFlagsBits.ManageGuild
    )
  ) {

    return interaction.reply({
      content:
        "❌ Tu n'as pas la permission.",
      ephemeral: true
    });

  }

  const updated =
    addXP(
      interaction.guild.id,
      interaction.user.id,
      amount
    );

  return interaction.reply(
    `⭐ **+${amount} XP**\n` +
    `Niveau actuel : **${updated.level}**`
  );
}


async function stats(interaction) {

  const user =
    getUser(
      interaction.guild.id,
      interaction.user.id
    );

  return interaction.reply(
    "📊 **STATISTIQUES**\n\n" +
    "❤️ Vitalité : **100**\n" +
    "🔮 Énergie magique : **100**\n" +
    `⚔️ Combat : **${10 + Math.floor(user.level / 2)}**\n` +
    `🛡️ Défense : **${10 + Math.floor(user.level / 2)}**\n` +
    `🧠 Intelligence : **${10 + Math.floor(user.level / 2)}**\n` +
    `⚡ Agilité : **${10 + Math.floor(user.level / 2)}**\n` +
    `✨ Contrôle magique : **${10 + user.level}**`
  );
}


async function points(interaction) {

  const subcommand =
    interaction.options.getSubcommand();

  if (subcommand === "classement") {

    const ranking =
      getHousePoints(
        interaction.guild.id
      );

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🏆 COUPE DES MAISONS")
          .setDescription(
            ranking.length
              ? ranking
                  .map(
                   
