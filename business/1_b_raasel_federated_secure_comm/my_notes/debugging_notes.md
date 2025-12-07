I was able to debug node js using two methods:
1) debug window in vscode, i had this script in my launchd.json file inside .vscode folder
 {
            "type": "node",
            "request": "launch",
            "name": "Debug Server",
            "program": "${workspaceFolder}/server/server.js",
            "cwd": "${workspaceFolder}/server",
            "env": {
                "NODE_ENV": "development",
                "DEBUG": "true"
            },
            "console": "integratedTerminal",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "sourceMaps": true
        },

2) Using this command line
npm run debug-nodemon

I had this script in package.json file
