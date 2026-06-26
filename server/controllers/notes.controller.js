import Notes from "../models/notes.model.js";

export const getMyNotes = async (req, res) => {
  // To get all note by user ID.
  try {
    // find by userid, we will get userid by isAuth middleware, we are sorting based or decending order of created at.
    const notes = await Notes.find({ user: req.userId })
      .select("topic classLevel examType revisionMode includeDiagram includeChart createdAt")
      .sort({ createdAt: -1 });
    if (notes.length === 0) {
      return res.status(404).json({ error: "Notes not found" });
    }
    return res.status(200).json(notes);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getCurrentUser notes error ${error}` });
  }
};

export const getSingleNotes = async (req, res) => {
  // To get a single notes
  try {
    const notes = await Notes.findOne({
      _id: req.params.id, // From paramenets in the frontend
      user: req.userId, // From isAuth middleware
    });
    if (!notes) {
      return res.status(404).json({ error: "Notes not found" });
    }
    return res.json({
      content: notes.content,
      topic: notes.topic,
      createdAt: notes.createdAt,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getSingleNotes notes error ${error}` });
  }
};
