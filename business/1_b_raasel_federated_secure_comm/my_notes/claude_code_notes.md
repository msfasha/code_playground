- Claude code can be installed using:
`npm install @anthropuc-ai/claude-code`
of course we need to claude in a project folder, code folder that is.
- Click shif+Tab twice you get into plan mode
- We need to generate `claude.md` file to provide context
- `/status` gives me status info
- We can change our model using `/model` command
- `clear`, we can also use `/clear` to clear context from time to time and clear the context window
- We can always ask claude to check our code for security compliance (ask for security checks)
we can use prompt like:
Please chek the code you wrote to make sure it follows security best practices. Make sure no sensitive information is in the front end or leaked and that are no vulnerabilities people can exploit.
-`ide` manages ide integrations, connect claude to vscode of cursor. This allows us to ask claude about any file we open in the ide.
-`init`, claude will examine the codebase and generate a claude.md context file or a memory file.
- We can drag and drop a file into claude command window, we can also reference it using @, we can also patse a screen shot

| Command                        | Description                                                                                                 |
|---------------------------------|-------------------------------------------------------------------------------------------------------------|
| `/add-dir`                     | Add a new working directory                                                                                 |
| `/bug`                         | Submit feedback about Claude Code                                                                           |
| `/clear`                       | Clear conversation history and free up context                                                              |
| `/compact [instructions]`      | Clear conversation history but keep a summary in context. Optionally provide summarization instructions      |
| `/config (theme)`              | Open config panel                                                                                           |
| `/cost`                        | Show the total cost and duration of the current session                                                     |
| `/doctor`                      | Diagnose and verify your Claude Code installation and settings                                              |
| `/exit` or `/quit`             | Exit the REPL                                                                                               |
| `/export`                      | Export the current conversation to a file or clipboard                                                      |
| `/help`                        | Show help and available commands                                                                            |
| `/hooks`                       | Manage hook configurations for tool events                                                                  |
| `/ide`                         | Manage IDE integrations and show status                                                                     |
| `/init`                        | Initialize a new CLAUDE.md file with codebase documentation                                                 |
| `/install-github-app`          | Set up Claude GitHub Actions for a repository                                                               |
| `/login`                       | Sign in with your Anthropic account                                                                         |
| `/logout`                      | Sign out from your Anthropic account                                                                        |
| `/mcp`                         | Manage MCP servers                                                                                          |
| `/memory`                      | Edit Claude memory files                                                                                    |
| `/migrate-installer`           | Migrate from global npm installation to local installation                                                  |
| `/model`                       | Set the AI model for Claude Code                                                                            |
| `/permissions (allowed-tools)` | Manage allow & deny tool permission rules                                                                   |
| `/pr-comments`                 | Get comments from a GitHub pull request                                                                     |
| `/release-notes`               | View release notes                                                                                          |
| `/resume`                      | Resume a conversation                                                                                       |
| `/review`                      | Review a pull request                                                                                       |
| `/status`                      | Show Claude Code status including version, model, account, API connectivity, and tool statuses              |
| `/upgrade`                     | Upgrade to Max for higher rate limits and more Opus                                                         |
| `/vim`                         | Toggle between Vim and Normal editing modes                                                                 |


