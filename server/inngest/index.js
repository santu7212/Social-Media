 import { Inngest } from "inngest";
import mongoose from "mongoose";
import User from "../models/user.model.js";

// Ensure MongoDB connection
if (!mongoose.connection.readyState) {
  await mongoose.connect(process.env.MONGODB_URI);
}

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
      const data = event.data;
      const { id, first_name, last_name, email_addresses, image_url } = data;

      // Safe email fallback
      const email = email_addresses?.[0]?.email_address || `user_${id}@plixa.local`;

      // Username from email, ensure uniqueness
      let username = email.split("@")[0];
      const existingUser = await User.findOne({ username });
      if (existingUser) username += Math.floor(Math.random() * 1000);

      // Full name and profile picture
      const full_name = `${first_name || ""} ${last_name || ""}`.trim();
      const profile_picture = image_url || "";

      const userData = { _id: id, email, full_name, username, profile_picture };

      console.log("🟢 Creating user:", userData);
      await User.create(userData);
      console.log("✅ User inserted successfully");
    } catch (err) {
      console.error("🔥 Error creating user:", err);
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
      const data = event.data;
      const { id, first_name, last_name, email_addresses, image_url } = data;

      // Safe email fallback
      const email = email_addresses?.[0]?.email_address || `user_${id}@plixa.local`;

      const updateUserData = {
        email,
        full_name: `${first_name || ""} ${last_name || ""}`.trim(),
        profile_picture: image_url || ""
      };

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
      const { id } = event.data;
      console.log("🟢 Deleting user:", id);
      await User.findByIdAndDelete(id);
      console.log("✅ User deleted successfully");
    } catch (err) {
      console.error("🔥 Error deleting user:", err);
      throw err;
    }
  }
);

// ---------------------
// Export Functions
// ---------------------
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
];
