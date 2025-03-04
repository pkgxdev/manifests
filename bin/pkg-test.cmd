@echo off
setlocal

:: Get the directory of the .cmd file
set SCRIPT_DIR=%~dp0

:: Run pkg-build.ts with Deno, passing all arguments
deno run --allow-all "%SCRIPT_DIR%pkg-test.ts" %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0