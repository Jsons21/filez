import db from "./client.js";

export async function createFolder({ folder_name }) {
  try {
    const SQL = `
    INSERT INTO folders (folder_name)
    VALUES($1) RETURNING *
    `;
    const { rows: folders } = await db.query(SQL, [folder_name]);
    console.log(folders);
    return folders;
  } catch (error) {
    console.error(error);
  }
}

export async function createFile({ file_name, size, folder_id }) {
  console.log(file_name, folder_id);
  try {
    const SQL = `
    INSERT INTO files (file_name, size, folder_id)
    VALUES($1, $2, $3) RETURNING *
    `;
    const { rows: folders } = await db.query(SQL, [file_name, size, folder_id]);
    console.log(folders);
    return folders;
  } catch (error) {
    console.error(error);
  }
}
