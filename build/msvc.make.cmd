@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

set ACTION=%1
if "%1" == "" set ACTION=make

echo - %BUILD_PROJECT% ^> %ACTION%

goto cmdXDefined
:cmdX
%*
if errorlevel 1 goto cmdXError
goto :eof
:cmdXError
echo "Error: %ACTION%"
exit 1
:cmdXDefined

if not "%ACTION%" == "make" goto :eof

call :cmdX xyo-cc --mode=%ACTION% --source-has-archive boost

if not exist output\ mkdir output
if not exist temp\ mkdir temp

set INCLUDE=%XYO_PATH_REPOSITORY%\include;%INCLUDE%
set LIB=%XYO_PATH_REPOSITORY%\lib;%LIB%
set WORKSPACE_PATH=%CD%
set WORKSPACE_PATH_OUTPUT=%WORKSPACE_PATH%\output
set WORKSPACE_PATH_BUILD=%WORKSPACE_PATH%\temp

if exist %WORKSPACE_PATH_BUILD%\build.done.flag goto :eof

pushd source

cmd.exe /C bootstrap.bat vc142

set CMD_RUN=b2
set CMD_RUN=%CMD_RUN% variant=release
set CMD_RUN=%CMD_RUN% link=static
set CMD_RUN=%CMD_RUN% threading=multi
set CMD_RUN=%CMD_RUN% runtime-link=static
set CMD_RUN=%CMD_RUN% architecture=x86
set CMD_RUN=%CMD_RUN% -j 16

if "%XYO_PLATFORM%" == "win64-msvc-2022" set CMD_RUN=%CMD_RUN% address-model=64
if "%XYO_PLATFORM%" == "win32-msvc-2022" set CMD_RUN=%CMD_RUN% address-model=32

if "%XYO_PLATFORM%" == "win64-msvc-2019" set CMD_RUN=%CMD_RUN% address-model=64
if "%XYO_PLATFORM%" == "win32-msvc-2019" set CMD_RUN=%CMD_RUN% address-model=32

if "%XYO_PLATFORM%" == "win64-msvc-2017" set CMD_RUN=%CMD_RUN% address-model=64
if "%XYO_PLATFORM%" == "win32-msvc-2017" set CMD_RUN=%CMD_RUN% address-model=32

set CMD_RUN=%CMD_RUN% toolset=msvc
set CMD_RUN=%CMD_RUN% --layout=system
set CMD_RUN=%CMD_RUN% --prefix="%WORKSPACE_PATH_OUTPUT%"
set CMD_RUN=%CMD_RUN% --no-cmake-config
set CMD_RUN=%CMD_RUN% --build-type=minimal
set CMD_RUN=%CMD_RUN% --build-dir="%WORKSPACE_PATH_BUILD%/boost-build"

set CMD_RUN=%CMD_RUN% install

%CMD_RUN%
if errorlevel 1 goto makeError

goto buildDone

:makeError
popd
echo "Error: make"
exit 1

:buildDone
popd
echo done > %WORKSPACE_PATH_BUILD%\build.done.flag

