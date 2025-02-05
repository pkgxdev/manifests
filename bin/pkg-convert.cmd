@echo off
setlocal

:: Get the directory of the .cmd file
set SCRIPT_DIR=%~dp0

:: Run pkg-build.ts with Deno, passing all arguments
pkgx -q make -f "%SCRIPT_DIR%pkg-convert" %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
