import data from "../models/data_models.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export const CreateNote = async (req, res) => {
  try {
    // Ensure that required fields are present in the request body
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required fields" });
    }

    // Create a new instance of the data model
    const newNote = new data({ title, content });

    // Save the new note to trigger validation
    const savedNote = await newNote.save();

    return res.status(201).json({ message: "Note added successfully", note: savedNote });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ message: "Invalid data format", error: error.errors });
    } else {
      // Other types of errors
      console.error("Error creating note:", error);
      return res.status(500).json({ message: "Failed to add note", error: error.message });
    }
  }
};

export const RetrieveNotes = async (req, res) => {
  try {
    const allNotes = await data.find();

    if (allNotes.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }

    return res.status(200).json({message:"Notes retrieved successfully",notes: allNotes});
  } catch (error) {
    console.error("Error retrieving notes:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve notes", error: error.message });
  }
};

export const RetrieveNote = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate input data
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }

    // Find the note with the given id
    const note = await data.findById(id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({message:"Note retrieved successfully",note: note });
  } catch (error) {
    console.error("Error retrieving note:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


export const UpdateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    // Validate input data
    if (!title && !content) {
      return res.status(400).json({ message: "Title or content is required for the update" });
    }

    // Find the note with the given id
    const existingNote = await data.findById(id);

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the fields of the existing note if new values are provided
    if (title) {
      existingNote.title = title;
    }

    if (content) {
      existingNote.content = content;
    }

    // Save the updated note
    const updatedNote = await existingNote.save();

    return res.json({ message: "Note updated successfully", note: updatedNote });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ message: "Invalid data format", error: error.errors });
    } else {
      // Other types of errors
      console.error("Error updating note:", error);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
};



export const DeleteNote = async (req, res) => {
  try {
    // Validate input data
    const { id } = req.params;

    // Validate if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID format" });
    }

    // Find and delete the note with the given id
    const deletedNote = await data.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.json({ message: "Note deleted successfully", note: deletedNote });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// A sample function to generate a JWT token (replace this with your authentication logic)
export const generateAuthToken = (req,res) => {
  const jwtToken = jwt.sign({ userId: "123", username: "john.doe" }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({message: "JwtToken", jwtToken: jwtToken});
};
