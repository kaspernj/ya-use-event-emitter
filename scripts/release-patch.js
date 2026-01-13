import {execSync} from "node:child_process"
import {readFileSync} from "node:fs"

const run = (command, options = {}) => execSync(command, {stdio: "inherit", ...options})

run("npm version patch --no-git-tag-version")
run("npm run build")

const packageUrl = new URL("../package.json", import.meta.url)
const {version} = JSON.parse(readFileSync(packageUrl, "utf8"))

run("git add -A")
run(`git commit -m "Release ${version}"`)
run("git push origin master")

try {
  execSync("npm whoami", {stdio: "ignore"})
} catch {
  run("npm login")
}

run("npm publish")
