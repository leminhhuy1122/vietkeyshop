const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const include = ["src"];
const exts = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".html",
  ".md",
  ".css",
  ".txt",
  ".env",
];
const suspects = {};

function walk(dir) {
  const items = fs.readdirSync(dir);
  for (const it of items) {
    const full = path.join(dir, it);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (
        ["node_modules", "dist", ".git", "public/uploads"].some((s) =>
          full.includes(path.sep + s),
        )
      )
        continue;
      walk(full);
    } else if (stat.isFile()) {
      if (!exts.includes(path.extname(full))) continue;
      const txt = fs.readFileSync(full, "utf8");
      const regex = /[\uFFFD\?ÃÂâ][^\s,.;:()\[\]"']*/g;
      const found = txt.match(regex);
      if (found) {
        found.forEach((tok) => {
          const key = tok.trim();
          if (!suspects[key]) suspects[key] = { count: 0, files: new Set() };
          suspects[key].count++;
          suspects[key].files.add(path.relative(root, full));
        });
      }
    }
  }
}

include.forEach((d) => walk(path.join(root, d)));

const out = [];
Object.keys(suspects)
  .sort((a, b) => suspects[b].count - suspects[a].count)
  .forEach((k) => {
    out.push(
      `${k}\t${suspects[k].count}\t${[...suspects[k].files].slice(0, 5).join(", ")}`,
    );
  });

fs.writeFileSync(path.join(root, "mojibake-suspects.txt"), out.join("\n"));
console.log("Wrote mojibake-suspects.txt with", out.length, "entries");
