# Debugging Guide for Raasel Server

## Quick Start

### 1. Using VS Code Debugger (Recommended)
1. Open VS Code in the project root
2. Go to Run and Debug panel (Ctrl+Shift+D)
3. Select one of the debug configurations:
   - **Debug Server**: Start server with debugging enabled
   - **Debug Server (Break on Start)**: Start server and break on first line
   - **Attach to Server**: Attach to already running server
   - **Debug Tests**: Debug Jest tests

### 2. Using Command Line
```bash
# Navigate to server directory
cd server

# Start with debugging (will open debugger on port 9229)
npm run debug

# Start with debugging and break on first line
npm run debug-brk

# Start with nodemon and debugging
npm run debug-nodemon
```

### 3. Using Chrome DevTools
1. Start server with: `npm run debug`
2. Open Chrome and go to: `chrome://inspect`
3. Click "Open dedicated DevTools for Node"
4. Set breakpoints and debug

## Debug Scripts

| Script | Description |
|--------|-------------|
| `npm run debug` | Start server with Node.js inspector |
| `npm run debug-brk` | Start server and break on first line |
| `npm run debug-nodemon` | Start with nodemon and debugging |
| `npm run test:debug` | Debug Jest tests |

## Environment Variables

Set these in your `.env` file for debugging:

```env
NODE_ENV=development
DEBUG=true
PORT=5000
```

## Debug Logging

The server includes built-in debug logging that can be enabled by setting `DEBUG=true` or `NODE_ENV=development`.

### Using Debug Logger in Routes

```javascript
const { DebugLogger } = require('../utils/debug');
const debug = new DebugLogger('clients');

// In your route handlers
app.get('/api/clients', (req, res) => {
  debug.log('Fetching clients');
  debug.request(req, res, () => {
    // Your route logic here
  });
});
```

### Performance Monitoring

```javascript
const { performance } = require('../utils/debug');

performance.start('database-query');
// Your database operation
performance.end('database-query');
```

## Common Debugging Scenarios

### 1. SSL Certificate Issues
If you get SSL errors, check:
- SSL certificates exist in `server/ssl/`
- Certificate files are readable
- Certificate paths are correct

### 2. Database Connection Issues
- Check database configuration in `config/database.js`
- Verify database is running
- Check connection strings

### 3. Socket.IO Issues
- Check CORS configuration
- Verify client URL in environment variables
- Check SSL certificate validity

### 4. Route Debugging
Add debug middleware to specific routes:

```javascript
const { DebugLogger } = require('../utils/debug');
const debug = new DebugLogger('route-name');

app.use('/api/route', debug.request);
```

## Debugging Tools

### 1. Node.js Inspector
- Port: 9229 (default)
- WebSocket endpoint: ws://localhost:9229
- HTTP endpoint: http://localhost:9229/json

### 2. Chrome DevTools
- Open `chrome://inspect`
- Click "Configure" to add localhost:9229
- Click "inspect" to open DevTools

### 3. VS Code Debugger
- Set breakpoints in your code
- Use F5 to start debugging
- Use F10 for step over, F11 for step into

## Troubleshooting

### Debugger Won't Connect
1. Check if port 9229 is available
2. Verify firewall settings
3. Try different port: `--inspect=9230`

### Breakpoints Not Working
1. Ensure source maps are enabled
2. Check file paths are correct
3. Restart debugger session

### Performance Issues
1. Use performance monitoring
2. Check for memory leaks
3. Profile with Node.js built-in profiler

## Advanced Debugging

### Memory Profiling
```bash
# Start with memory profiling
node --inspect --prof server.js

# Analyze heap snapshots
node --inspect --heapsnapshot-signal=SIGUSR2 server.js
```

### CPU Profiling
```bash
# Start with CPU profiling
node --inspect --prof server.js

# Generate flamegraph
node --prof-process isolate-*.log > processed.txt
```

### Network Debugging
```bash
# Monitor network requests
DEBUG=express:* npm run dev

# Monitor Socket.IO
DEBUG=socket.io:* npm run dev
``` 