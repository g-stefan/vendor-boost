@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

rem --- make

cmd.exe /C build\msvc.make.cmd
if errorlevel 1 exit 1

rem --- dev

if not exist "%INSTALL_PATH_DEV%\" mkdir "%INSTALL_PATH_DEV%"
if not exist "%INSTALL_PATH_DEV%\include" mkdir "%INSTALL_PATH_DEV%\include"
if not exist "%INSTALL_PATH_DEV%\lib" mkdir "%INSTALL_PATH_DEV%\lib"
xcopy /Y /S /E "temp\boost\include\" "%INSTALL_PATH_DEV%\include\"
copy /Y /B "temp\boost\lib\*.lib" "%INSTALL_PATH_DEV%\lib\*"
