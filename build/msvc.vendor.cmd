@echo off
rem Public domain
rem http://unlicense.org/
rem Created by Grigore Stefan <g_stefan@yahoo.com>

echo -^> vendor vendor-boost

if not exist archive\ mkdir archive

pushd archive
set VENDOR=boost-1.74.0
set WEB_LINK=https://dl.bintray.com/boostorg/release/1.74.0/source/boost_1_74_0.zip
if not exist %VENDOR%.zip curl --insecure --location %WEB_LINK% --output %VENDOR%.zip
7z x -aoa -o. %VENDOR%.zip
del /F /Q %VENDOR%.zip
move boost_1_74_0 boost-1.74.0
if exist %VENDOR%.7z del /F /Q %VENDOR%.7z
7zr a -mx9 -mmt4 -r- -sse -w. -y -t7z %VENDOR%.7z %VENDOR%
rmdir /Q /S %VENDOR%
popd
