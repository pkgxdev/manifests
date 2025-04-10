@echo off
setlocal

set CMAKE_PREFIX_PATH=%PKGS%

pkgx -q cmake %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
