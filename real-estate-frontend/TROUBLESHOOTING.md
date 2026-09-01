# ✅ Complete Troubleshooting Guide - Properties Not Showing

## 📊 Current Status

Your frontend is **correctly built** and **ready to receive data**.
The issue is that the **backend is not reachable** on port 5000.

---

## 🚀 QUICK FIX - 3 Steps

### Step 1: Check Backend Status

Open PowerShell and run:

```powershell
netstat -ano | findstr :5000
```

**If you see output like:**
```
TCP    127.0.0.1:5000         0.0.0.0:0              LISTENING       5432
```
→ Backend IS running ✅

**If you see NO output:**
→ Backend is NOT running ❌ → Go to Step 2

---

### Step 2: Start Your Backend

Navigate to your backend folder and run:

```bash
npm start
# OR
node server.js
# OR
npm run dev
```

Wait for the message: `Server running on port 5000` or similar.

---

### Step 3: Test the Properties Page

1. Open browser: `http://localhost:5173/properties` (or your Vite port)
2. **Properties should now appear!**

If they still don't appear → Go to **Diagnostic Tool** below

---

## 🔍 Diagnostic Tool (If Still Broken)

I've created a visual debug page for you.

### Access It:

1. Run your frontend dev server: `npm run dev`
2. Open: `http://localhost:5173/api-debug`
3. Look at the results:

**What each result means:**

| Status | Meaning | Solution |
|--------|---------|----------|
| ✅ Connected Successfully | Backend is working | Properties should appear on /properties page |
| ❌ Connection refused | Backend not running | Start your backend server |
| ❌ No response from server | Backend on wrong port | Update baseURL in `src/api/API.js` |
| Empty array returned | Backend has no data | Add properties in the backend |

---

## 🛠️ Backend on Different Port?

If your backend is on **port 3000** or **port 8000**, you need to update the frontend:

**File:** `src/api/API.js`

Change this line:
```javascript
const API = axios.create({
    baseURL: "http://localhost:5000/api",  // ← Change 5000 to your port
    timeout: 10000,
});
```

Example for port 3000:
```javascript
const API = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 10000,
});
```

Then rebuild:
```powershell
npm run build
```

---

## 📝 Files I've Fixed for You

| File | Change |
|------|--------|
| `src/Pages/Properties.jsx` | ✅ Handles multiple response formats |
| `src/api/API.js` | ✅ Already has JWT & error interceptors |
| `src/App.jsx` | ✅ Added `/api-debug` diagnostic route |
| `src/Pages/APIDebug.jsx` | ✨ NEW: Visual debugging tool |

---

## 🎯 What to Report (If Still Broken)

Use the `/api-debug` page and tell me:

1. **Status:** (✅ Connected / ❌ Connection refused / other)
2. **Raw API Response:** (What you see in the JSON section)
3. **Number of properties:** (0, 5, 100, etc.)
4. **Backend port:** (5000, 3000, 8000, etc.)
5. **Error message from DevTools Console:** (Press F12 → Console tab)

---

## 🧪 Quick Validation Commands

### Test all common ports:

```powershell
@(3000, 3001, 5000, 8000, 8080, 5500) | ForEach-Object {
    Write-Host "Testing :$_..." -ForegroundColor Cyan
    try {
        $r = Invoke-WebRequest "http://localhost:$_/api/properties" -TimeoutSec 2 -ErrorAction Stop
        Write-Host "✓ Port $_ WORKS! Status: $($r.StatusCode)" -ForegroundColor Green
    } catch {
        Write-Host "✗ Port $_ failed" -ForegroundColor Red
    }
}
```

---

## ✨ Frontend Changes Summary

### Property Response Handling
Your Properties page now handles:
- Direct array: `[{...}, {...}]`
- Nested under `data`: `{ data: [{...}] }`
- Nested under `properties`: `{ properties: [{...}] }`
- Fallback values for missing fields

### Error Handling
- Shows friendly error messages
- Logs detailed errors to browser console
- Falls back gracefully if backend is down

---

## Next Actions

1. **Start backend** (if not running)
2. **Visit** `http://localhost:5173/api-debug` to verify connection
3. **Verify** properties appear on `/properties` page
4. **Remove** the debug page from App.jsx before going to production:
   ```jsx
   // Delete this route:
   <Route path="/api-debug" element={<APIDebug />} />
   ```

---

## 📞 Still Broken?

1. Share output from `/api-debug` page
2. Share browser console errors (F12 → Console)
3. Tell me exact backend port
4. I'll fix it immediately!
