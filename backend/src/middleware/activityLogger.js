import openDB from "../models/database.js";

export const logActivity = async (req, res, next) => {

    console.log("logging info")

  res.on("finish", async () => {
    try {
      // You can customize these fields based on what route is hit
      const method = req.method;
      const path = req.originalUrl;
      const userId = req.user?.id || null; // If user is logged in
      let title = "";
      let description = "";

      // Customize by route (you can expand this later)
      if (path.includes("/api/messages")) {
        title = "Message Notification";
        description = "You have a new unread message in your inbox.";
      } else if (path.includes("/calendar")) {
        title = "Calender Notification";
        description = "You have a new calender notification";
      } else if (path.includes("/calls")) {
        title = "Call";
        description = "You got a new call.";
      } else if (path.includes("/add-friend")) {
        title = "New Contact";
        description = "You got a new contact checkout now.";
      } 
      else if (path.includes("/join-community")) {
        title = "Community";
        description = "You joined a new community, explore now!";
      } 
      else if (path.includes("/leave-community")) {
        title = "Community";
        description = "You left your community, check now!";
      } 
      

      if (title) {
        const db = await openDB();
        await db.run(
          `INSERT INTO activity (title, description, user_id) VALUES (?, ?, ?)`,
          [title, description, userId]
        );
      }
    } catch (err) {
      console.error("Error logging activity:", err);
    }
  });

  next();
};
