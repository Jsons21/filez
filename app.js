import express from "express";
import {
  createFileForFolder,
  getAllFiles,
  getAllFolders,
  getFolderById,
} from "#db/queries/files";
import db from "#db/client";
const app = express();
export default app;

app.use(express.json());

app.get("/files", async (req, res) => {
  try {
    const files = await getAllFiles();
    res.status(200).json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/folders", async (req, res) => {
  try {
    const folders = await getAllFolders();
    res.status(200).json(folders);
  } catch (error) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/folders/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const folder = await getFolderById(id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.status(200).json(folder);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/folders/:id/files", async (req, res) => {
  const folderId = Number(req.params.id);

  if (!folderId || folderId < 1) {
    return res.status(404).json({ error: "Folder not found" });
  } //checks to make sure i dont send and NaN

  if (!req.body) {
    return res.status(400).json({ error: "Body required" });
  }

  const { name, size } = req.body;
  if (!name || typeof size !== "number") {
    return res.status(400).json({ error: "Name and file size required" });
  }
  try {
    const { rowCount } = await db.query(`SELECT 1 FROM folders WHERE id =$1;`, [
      folderId,
    ]);
    //SELECT 1 if a row exists, return a constant value of 1.
    //SELECT 1 FROM folders WHERE id=5; returns noting if there is no folder with an id of 5.
    if (rowCount === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }
    const file = await createFileForFolder(folderId, { name, size });
    res.status(201).json(file);
  } catch (err) {
    console.error("POST /folders/:id/files error:", err);
    res.status(500).send("Internal Server Error");
  }
});
