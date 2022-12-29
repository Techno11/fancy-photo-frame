import fs from "fs";
import * as os from "os";
import path from "path";
import mime from "mime";

export function getPhoto(): string {
  // Home directory (fix for running as root)
  const homeDir = os.homedir().includes("/root") ? "/home/emily" : os.homedir();
  // Photos directory
  const baseDir = path.join(homeDir, "Pictures");
  // Get all photos
  const dir = fs.readdirSync(baseDir);
  const photos = dir.filter(f => {
    const ct = mime.getType(f);
    return fs.statSync(path.join(baseDir, f)).isFile() && ct && ct.startsWith("image/");
  });
  // The Photo Path
  let photoPath = "";
  // Check if there are any photos
  if(photos.length === 0) {
    photoPath = path.join(__dirname, "../assets/empty.png");
  } else {
    // Get random photo
    const photo = photos[Math.floor(Math.random() * photos.length)];
    photoPath = path.join(baseDir, photo)
  }
  // Return path
  return photoPath;
}