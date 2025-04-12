@echo off
setlocal

set CMAKE_PREFIX_PATH=%PKGS%
set CMAKE_GENERATOR=Ninja

pkgx -q cmake %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
