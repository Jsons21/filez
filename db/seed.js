import db from "./client.js";
import { faker } from "@faker-js/faker";

async function seed() {
  await db.query("TRUNCATE files, folders RESTART IDENTITY CASCADE;");

  const folderIds = [];
  for (let i = 0; i < 3; i++) {
    const folderName = faker.word.noun();
    const { rows } = await db.query(
      `INSERT INTO folders (name) VALUES ($1) RETURNING id;`,
      [folderName]
    );
    folderIds.push(rows[0].id);
  }
  for (const folderId of folderIds) {
    for (let i = 0; i < 5; i++) {
      const fileName = faker.system.fileName();
      const fileSize = faker.number.int({ min: 500, max: 5000 });
      await db.query(
        `INSERT INTO files (name, size, folder_id) Values ($1,$2,$3);`,
        [fileName, fileSize, folderId]
      );
    }
  }
}

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");
