import Chat from "@models/Chat";
import Message from "@models/Message";
import { connectToDB } from "@mongodb";


export const DELETE = async (req, { params }) => {
    try {
      await connectToDB();
  
      const { messageId } = params;
  
      const deletedMessage = await Message.findByIdAndDelete(messageId);
  
      if (!deletedMessage) {
        return new Response("Message not found", { status: 404 });
      }
  
      // Optionally, you can remove the reference to the deleted message from the chat
      await Chat.updateOne(
        { _id: deletedMessage.chat },
        { $pull: { messages: messageId } }
      );
  
      return new Response("Message deleted successfully", { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to delete message", { status: 500 });
    }
  };

  export const PATCH = async (req, { params }) => {
    try {
      await connectToDB();
  
      const { messageId } = params;
      const { newText } = await req.json();
  
      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        { text: newText },
        { new: true } // Return the updated document
      )
        .populate("sender")
        .exec();
  
      if (!updatedMessage) {
        return new Response("Message not found", { status: 404 });
      }
  
      return new Response(JSON.stringify(updatedMessage), { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response("Failed to update message", { status: 500 });
    }
  };