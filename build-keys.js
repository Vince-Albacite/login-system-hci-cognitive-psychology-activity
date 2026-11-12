const fs = require("fs");
const NAMES = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "EMAILJS_PUBLIC_KEY",
  "EMAILJS_SERVICE_ID",
  "EMAILJS_TEMPLATE_ID",
  "ADMIN_EMAIL"
];
let text = "";
for (const name of NAMES) {
  const value = process.env[name];
  if (!value) {
    console.error("Missing Vercel variable: " + name);
    process.exit(1);
  }
  text += "const " + name + " = " + JSON.stringify(value) + ";\n";
}
fs.writeFileSync("src/keys.js", text);
