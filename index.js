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
const TOKEN = process.env.TOKEN;
const PRIVATE_CHANNEL_ID = process.env.PRIVATE_CHANNEL_ID;

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
      content: "📋 **Staff Applications**\n\nTo apply for staff, click the button below:",
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
      .setLabel("Roblox Profile")
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

    const applicantId = interaction.user.id;
    const channel = await client.channels.fetch(PRIVATE_CHANNEL_ID);

    // Create Accept and Reject buttons
    const acceptButton = new ButtonBuilder()
      .setCustomId(`accept_${applicantId}`)
      .setLabel("✅ Accept")
      .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
      .setCustomId(`reject_${applicantId}`)
      .setLabel("❌ Reject")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(acceptButton, rejectButton);

    // Send application to private channel with buttons
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

Submitted by: <@${applicantId}>`,
      components: [row],
    });

    await interaction.reply({
      content: "✅ Your staff application has been submitted!",
      ephemeral: true
    });
  }

  // --- ACCEPT / REJECT HANDLER ---
  if (interaction.isButton()) {
    const [action, applicantId] = interaction.customId.split("_");

    // Only admins can click
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "❌ You are not allowed to do this.", ephemeral: true });
    }

    const user = await client.users.fetch(applicantId);

    if (action === "accept") {
      // DM the applicant
      user.send("🎉 Congratulations! Your staff application has been accepted. You will be notified further soon.")
        .catch(() => console.log("Could not DM user"));

      await interaction.update({ content: interaction.message.content + "\n\n✅ Accepted by " + interaction.user.tag, components: [] });
    }

    if (action === "reject") {
      // DM the applicant
      user.send("❌ Your staff application has been declined. Try again next time.")
        .catch(() => console.log("Could not DM user"));

      await interaction.update({ content: interaction.message.content + "\n\n❌ Declined by " + interaction.user.tag, components: [] });
    }
  }
});

// ===== LOGIN BOT (VERY BOTTOM) =====
client.login(TOKEN);





