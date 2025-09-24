import db from "../client.js";

export async function getAllFiles() {
  const SQL = `SELECT files.*, folders.name AS folder_name
    FROM files
    JOIN folders ON files.folder_id = folders.id
    ORDER BY files.id;
  `;
  const { rows } = await db.query(SQL);
  return rows;
}

export async function getAllFolders() {
  const SQL = `SELECT * FROM folders ORDER BY id;`;
  const { rows } = await db.query(SQL);
  return rows;
}

export async function getFolderById(id) {
  const { rows: folderRows } = await db.query(
    "SELECT * FROM folders WHERE id = $1;",
    [id]
  );
  if (folderRows.length === 0) return undefined;

  const folder = folderRows[0];

  const { rows: files } = await db.query(
    "SELECT * FROM files WHERE folder_id = $1 ORDER BY id;",
    [id]
  );

  return { ...folder, files };
}

export async function createFileForFolder(folderId, { name, size }) {
  const SQL = `
    INSERT INTO files (name, size, folder_id)
    VALUES ($1, $2, $3)
    RETURNING *; 
    `;
  const { rows } = await db.query(SQL, [name, size, folderId]);
  return rows[0];
}
