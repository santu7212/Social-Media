import { Inngest } from "inngest";
import User from "../models/user.model.js";
import Connection from "../models/connection.model.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "plixa-app" });

// ---------------------
// Create User Function
// ---------------------
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      // Handle array-wrapped event
      const incomingEvent = Array.isArray(event) ? event[0] : event;
      const data = incomingEvent.data;

      const {
        id,
        first_name,
        last_name,
        email_addresses,
        image_url,
        external_accounts,
      } = data;

      // Safe email fallback
      const email =
        email_addresses?.[0]?.email_address ||
        external_accounts?.[0]?.email_address ||
        `user_${id}@plixa.local`;

      // Username derived from email
      let username = email.split("@")[0];
      const existingUser = await User.findOne({ username });
      if (existingUser) username += Math.floor(Math.random() * 1000);

      // Full name and profile picture
      const full_name = `${first_name || ""} ${last_name || ""}`.trim();
      const profile_picture =
        image_url || external_accounts?.[0]?.image_url || "";

      const userData = { _id: id, email, full_name, username, profile_picture };

      console.log("🟢 Creating user:", userData);
      await User.create(userData);
      console.log("✅ User inserted successfully");
    } catch (err) {
      console.error("🔥 Error inserting user:", err);
      throw err;
    }
  }
);

// ---------------------
// Update User Function
// ---------------------
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const incomingEvent = Array.isArray(event) ? event[0] : event;
      const data = incomingEvent.data;

      const {
        id,
        first_name,
        last_name,
        email_addresses,
        image_url,
        external_accounts,
      } = data;

      const email =
        email_addresses?.[0]?.email_address ||
        external_accounts?.[0]?.email_address ||
        `user_${id}@plixa.local`;
      const full_name = `${first_name || ""} ${last_name || ""}`.trim();
      const profile_picture =
        image_url || external_accounts?.[0]?.image_url || "";

      const updateUserData = { email, full_name, profile_picture };

      console.log("🟢 Updating user:", updateUserData);
      await User.findByIdAndUpdate(id, updateUserData, { new: true });
      console.log("✅ User updated successfully");
    } catch (err) {
      console.error("🔥 Error updating user:", err);
      throw err;
    }
  }
);

// ---------------------
// Delete User Function
// ---------------------
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const incomingEvent = Array.isArray(event) ? event[0] : event;
      const { id } = incomingEvent.data;

      console.log("🟢 Deleting user:", id);
      await User.findByIdAndDelete(id);
      console.log("✅ User deleted successfully");
    } catch (err) {
      console.error("🔥 Error deleting user:", err);
      throw err;
    }
  }
);

// Inngest function to send reminder when a new connection request is added
const sendNewConnectionRequestReminder = inngest.createFunction(
  { id: "send-new-connection-request-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-request-mail", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );
      const subject = `👋 New connection request `;

      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
<h2>Hi ${connection.to_user_id.full_name},</h2>
<p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
<p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:
#10b981;">here</a> to accept or reject the request</p>
<br/>
<p>Thanks, <br/>PingUp - Stay Connected</p>
</div>`;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });
    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-for-24-hours", in24Hours);
    await step.run("send-connection-request-reminder", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      if (connection.status === "accepted") {
        return { message: "Already accepted" };
      }
      const subject = `👋 New connection request `;

      const body = `<div style="font-family: Arial, sans-serif; padding: 20px;">
<h2>Hi ${connection.to_user_id.full_name},</h2>
<p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
<p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:
#10b981;">here</a> to accept or reject the request</p>
<br/>
<p>Thanks, <br/>PingUp - Stay Connected</p>
</div>`;
      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });

      return { message: "Reminder sent." };
    });
  }
);

// ---------------------
// Export Functions
// ---------------------
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  sendNewConnectionRequestReminder,
];
