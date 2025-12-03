@echo off
echo 🔍 Testing Backend Connectivity...
echo.

REM Test from host machine
echo 📋 Testing from host machine (localhost):
echo Machine API:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/machine' -UseBasicParsing -TimeoutSec 5; $response.StatusCode } catch { $_.Exception.Message }"
echo.

echo Staff API:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/staff' -UseBasicParsing -TimeoutSec 5; $response.StatusCode } catch { $_.Exception.Message }"
echo.

echo Group API:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/group' -UseBasicParsing -TimeoutSec 5; $response.StatusCode } catch { $_.Exception.Message }"
echo.

echo Process API:
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/drawing-code-process' -UseBasicParsing -TimeoutSec 5; $response.StatusCode } catch { $_.Exception.Message }"
echo.

echo 🐳 Testing from Docker would require running container
echo.

echo ✅ Backend connectivity test complete!
echo.
echo Expected responses:
echo - 200: API is working
echo - 404: Endpoint not found but server is reachable  
echo - Error message: Server is not running or not accessible