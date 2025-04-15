@echo off
setlocal

pkgx -q python~3.9 %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
