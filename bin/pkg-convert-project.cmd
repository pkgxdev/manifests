@echo off
setlocal

set SCRIPT_DIR=%~dp0

pkgx -q deno run --ext=ts -RW "%SCRIPT_DIR%pkg-convert-project" %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
