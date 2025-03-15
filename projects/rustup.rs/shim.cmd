@echo off
setlocal

:: Check if the Rust environment file exists
if not exist "%USERPROFILE%\.cargo\env" (
    :: Get the directory of the script
    set "D=%~dp0"
    set "D=%D:~0,-1%"  :: Remove trailing backslash

    :: Remove ourselves from PATH to prevent warnings from rustup-init
    for %%I in ("%D%") do (
        for /f "delims=;" %%A in ('echo %PATH% ^| findstr /v /i "%%~I"') do (
            set "SANITIZED_PATH=%%A"
        )
    )

    :: Run rustup-init with sanitized PATH
    set "PATH=%SANITIZED_PATH%"
    "%D%\rustup-init.exe" -y --no-modify-path
    if errorlevel 1 exit /b %errorlevel%
)

:: Load Rust environment
for /f "usebackq delims=" %%A in ("%USERPROFILE%\.cargo\env") do call %%A

:: Re-execute this script with the same arguments
set "SCRIPT_NAME=%~nx0"
call %SCRIPT_NAME% %*`
