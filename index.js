const {
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ===== PUT THESE ONLY ONCE (TOP OF FILE) =====
const TOKEN = "MTQ1MDc3NjcwNDU0ODMzOTc0Mg.GYvPR6.5Pj-x6LXXfvdG6HWryFMMQ_tLegUOkl4Y-iW7U";
const PRIVATE_CHANNEL_ID = "1450787132942712892";

// ===== BOT ONLINE MESSAGE =====
client.once("ready", () => {
  console.log("✅ Bot is online!");
});

// ===== SEND BUTTON MESSAGE =====
client.on("messageCreate", async (message) => {
  if (message.content === "!sendform") {

    const button = new ButtonBuilder()
      .setCustomId("open_staff_form")
      .setLabel("Apply for Staff")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      content: "Click the button below to apply for staff:",
      components: [row]
    });
  }
});

// ===== BUTTON + FORM HANDLER =====
client.on("interactionCreate", async (interaction) => {

  // --- BUTTON CLICK ---
  if (interaction.isButton() && interaction.customId === "open_staff_form") {

    const modal = new ModalBuilder()
      .setCustomId("staff_form")
      .setTitle("Staff Application");

    const q1 = new TextInputBuilder()
      .setCustomId("discord_name")
      .setLabel("Discord Username")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const q2 = new TextInputBuilder()
      .setCustomId("roblox_profile")
      .setLabel("Roblox Profile (username or link)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const q3 = new TextInputBuilder()
      .setCustomId("why_staff")
      .setLabel("Why are you applying for staff?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const q4 = new TextInputBuilder()
      .setCustomId("bring_team")
      .setLabel("What can you bring to the staff team?")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const q5 = new TextInputBuilder()
      .setCustomId("join_date")
      .setLabel("When did you join?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(q1),
      new ActionRowBuilder().addComponents(q2),
      new ActionRowBuilder().addComponents(q3),
      new ActionRowBuilder().addComponents(q4),
      new ActionRowBuilder().addComponents(q5)
    );

    await interaction.showModal(modal);
  }

  // --- FORM SUBMIT ---
  if (
    interaction.type === InteractionType.ModalSubmit &&
    interaction.customId === "staff_form"
  ) {

    const channel = await client.channels.fetch(PRIVATE_CHANNEL_ID);

    await channel.send({
      content: `📋 **NEW STAFF APPLICATION**

👤 Discord Username:
${interaction.fields.getTextInputValue("discord_name")}

🎮 Roblox Profile:
${interaction.fields.getTextInputValue("roblox_profile")}

📝 Why Staff:
${interaction.fields.getTextInputValue("why_staff")}

💪 What they bring:
${interaction.fields.getTextInputValue("bring_team")}

📅 Joined:
${interaction.fields.getTextInputValue("join_date")}

Submitted by: ${interaction.user.tag}`
    });

    await interaction.reply({
      content: "✅ Your staff application has been submitted!",
      ephemeral: true
    });
  }
});

// ===== LOGIN BOT (VERY BOTTOM) =====
client.login(TOKEN);


