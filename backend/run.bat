@echo off
setlocal

if /i "%~1"=="run" goto run
if /i "%~1"=="test" goto test
if "%~1"=="" goto test

echo Usage: %~nx0 [test^|run]
exit /b 2

:test
pushd "%~dp0"
go test ./...
set "result=%ERRORLEVEL%"
popd
exit /b %result%

:run
pushd "%~dp0"
go run ./cmd/api
set "result=%ERRORLEVEL%"
popd
exit /b %result%