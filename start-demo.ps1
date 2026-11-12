$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PgBin = "C:\Program Files\PostgreSQL\18\bin"
$PgData = Join-Path $Root ".pgdata"
$PgLog = Join-Path $PgData "postgres.log"

# 1. Detect current Wi-Fi / LAN IPv4 so mobile Expo Go always connects even on new Wi-Fi
$Ip = (node -e "const os = require('os'); const nets = os.networkInterfaces(); const found = []; for (const [name, addrs] of Object.entries(nets)) { for (const a of addrs || []) { if (a.family === 'IPv4' && !a.internal && !/vEthernet|WSL|Loopback/i.test(name) && !a.address.startsWith('169.254.')) found.push({ name, address: a.address }); } } const wifi = found.find(x => /wi-fi|wifi|wlan/i.test(x.name)); console.log((wifi || found[0] || {}).address || 'localhost');").Trim()

if (-not $Ip) { $Ip = "localhost" }
Write-Host "Detected LAN IP: $Ip" -ForegroundColor Cyan

# Update mobile-app/.env and backend/.env BASE_URL dynamically
Set-Content -Path (Join-Path $Root "mobile-app\.env") -Value "EXPO_PUBLIC_API_BASE_URL=http://${Ip}:5000"
$BackendEnvPath = Join-Path $Root "backend\.env"
if (Test-Path $BackendEnvPath) {
  $envContent = Get-Content $BackendEnvPath -Raw
  $envContent = $envContent -replace "(?m)^BASE_URL=.*$", "BASE_URL=http://${Ip}:5000"
  Set-Content -Path $BackendEnvPath -Value $envContent.TrimEnd()
}

# 2. Start local PostgreSQL cluster on port 5433 if not already running
& "$PgBin\pg_isready.exe" -h localhost -p 5433 | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Starting local PostgreSQL on port 5433..." -ForegroundColor Yellow
  Start-Process -FilePath "$PgBin\postgres.exe" -ArgumentList "-D", $PgData, "-p", "5433" -WindowStyle Hidden
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 500
    & "$PgBin\pg_isready.exe" -h localhost -p 5433 | Out-Null
    if ($LASTEXITCODE -eq 0) { break }
  }
}
Write-Host "PostgreSQL ready on localhost:5433" -ForegroundColor Green

# 3. Start Backend & Admin Frontend in new PowerShell windows
Write-Host "Starting Backend on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\backend'; npm run dev"

Write-Host "Starting Admin Frontend on http://localhost:3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root\admin-frontend'; npm run dev"

# 4. Start Expo Go in this terminal so the QR code is visible
Write-Host "Starting Expo Go (scan the QR code with Expo Go on your phone)..." -ForegroundColor Green
Set-Location (Join-Path $Root "mobile-app")
npx expo start -c
