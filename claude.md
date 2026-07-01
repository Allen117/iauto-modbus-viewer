# iAUTO Modbus TCP Communication Viewer

Node.js/Express web application for reading and displaying Modbus TCP data from industrial devices.

## Tech Stack

- Backend: Node.js + Express
- Frontend: Single HTML page (public/index.html)
- Protocol: Modbus TCP (modbus-serial)

## Project Structure

- `server.js` - Express server, API endpoint `/api/read`
- `public/index.html` - Web UI (Traditional Chinese)
- `package.json` - Dependencies: express, modbus-serial

## Commands

- Start server: `node server.js` (port 3000)
- Syntax check: `node -c server.js`

## Allowed Tools

Commands that do not require user confirmation:

```
node -c *
node -e *
node server.js
npm install
npm start
npm test
for /f "tokens=5" %a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %a /F
```
