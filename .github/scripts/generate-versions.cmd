@echo off
setlocal

set SCRIPT_DIR=%~dp0

pkgx -q deno run --ext=ts --quiet --allow-net --allow-read --allow-env --allow-sys "%SCRIPT_DIR%generate-versions" %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
