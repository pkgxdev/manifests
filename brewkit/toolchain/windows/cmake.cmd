@echo off
setlocal

if defined CMAKE_PREFIX_PATH (
    set CMAKE_PREFIX_PATH=%PKGS%;%CMAKE_PREFIX_PATH%
) else (
    set CMAKE_PREFIX_PATH=%PKGS%
)

if not defined CMAKE_GENERATOR set CMAKE_GENERATOR=Ninja
if not defined CMAKE_BUILD_TYPE set CMAKE_BUILD_TYPE=Release

pkgx -q cmake^^3 %*
if %ERRORLEVEL% NEQ 0 exit /b %ERRORLEVEL%

endlocal
exit /b 0
