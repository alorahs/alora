import { spawn } from "child_process";

function run(command, cwd) {
  const [cmd, ...args] = command.split(" ");
  const proc = spawn(cmd, args, { cwd, stdio: "inherit", shell: true });
  return proc;
}

console.log("🚀 Starting Backend...");
run("npm install && nodemon server.js", "./backend");

console.log("🌐 Starting Frontend...");
run("npm install && npm run dev", "./myapp");
