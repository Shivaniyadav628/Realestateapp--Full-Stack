# Backend Connectivity Debug Guide

## Problem
Properties are not visible in the frontend despite working in the backend.

## Root Cause
The frontend tries to connect to `http://localhost:5000/api/properties` but the backend server is either:
1. ❌ Not running at all
2. ❌ Running on a different port (not 5000)
3. ❌ Not at localhost (running on a different machine)

---

## Step 1: Check if Backend is Running

### Windows PowerShell:
```powershell
# Check if port 5000 is listening
netstat -ano | findstr :5000
```

**Expected output if running:**
```
TCP    127.0.0.1:5000         0.0.0.0:0              LISTENING       12345
```

**If NO output:** Backend is NOT running on port 5000

---

## Step 2: Find the Real Backend Port

### Windows PowerShell:
```powershell
# List ALL listening ports
netstat -ano | findstr LISTENING
```

Look for a Node.js process. Common real estate app ports:
- 3000
- 3001
- 5000
- 8000
- 8080
- 5500

---

## Step 3: Test Backend Endpoint

### Windows PowerShell:
```powershell
# Test the real endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/properties" -Method GET
```

Replace `5000` with the actual port if different.

**If connection refused:** Backend is not running on that port
**If 200 OK:** Backend is working! Check the response data

---

## Step 4: Start Your Backend

Find your backend folder and run:
```bash
npm start
# OR
node server.js
# OR
yarn dev
```

---

## Step 5: Update Frontend API URL (if needed)

If your backend runs on a different port, update:

**File:** `src/api/API.js`

```javascript
const API = axios.create({
    baseURL: "http://localhost:YOUR_ACTUAL_PORT/api",  // ← Change this
    timeout: 10000,
});
```

Then rebuild:
```powershell
npm run build
```

---

## Step 6: Browser Console Check

1. Open your app in browser: `http://localhost:5173` (or wherever Vite is serving)
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for error messages starting with "ERROR fetching properties"
5. Copy the exact error and share it

---

## Quick Test Script

Run this PowerShell command to test all common ports at once:

```powershell
$ports = 3000, 3001, 5000, 8000, 8080, 5500

foreach ($port in $ports) {
    Write-Host "Testing port $port..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$port/api/properties" -Method GET -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✓ FOUND: Port $port is working!" -ForegroundColor Green
        Write-Host "Response: $($response.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Port $port: Not responding" -ForegroundColor Red
    }
}
```

---

## What to Tell Me

Run the steps above and provide:
1. **Port number where backend is actually running** (or "backend not running")
2. **Error message from browser Console** (if any)
3. **Response data** (if backend is reachable)

Then I can fix it in 1 minute!
