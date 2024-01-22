const Notification = require("../Models/Notification");
const { getIO } = require("../config/socket"); // Import the getIO function
const mongoose = require("mongoose")



  exports.sendNotificationToAdmin = async (title,content, type="NOTIFICATION") => {



    // Check if the user is connected to a socket room with their ID
    
    const io = getIO();
    // Get the socket associated with the room
    const userSocket = io.sockets.in("admin");


    console.log(userSocket)
  

    if (userSocket) {
      // Emit a custom event for the notification
      userSocket.emit("notification", { title,content,isRead:false });
  
      // Save the notification to the database
      try {
        const notification = new Notification({
            title,
          content: content,
          isRead: false,
          type,
        });
        await notification.save();
        console.log("Notification saved to the database.");
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    } else {
      console.log(`User with ID admin is not connected.`);
    }
  };



