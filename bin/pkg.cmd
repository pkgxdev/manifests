@echo off
setlocal

:: Get the directory of the .cmd file
set SCRIPT_DIR=%~dp0

:: Run pkg-build.ts with Deno, passing all arguments
pkgx -q deno run --ext=ts --allow-all "%SCRIPT_DIR%pkg" %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
