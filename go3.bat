@echo off

call C:\Users\Alan\AppData\Roaming\npm\yarn.cmd cli --output ./test.json --input %*
if %errorlevel% neq 0 exit /b %errorlevel%
echo.
echo OUTPUT:
call cat test.json
REM copy /Y recipes-full.json ..\recipes-react-app\src\recipes-full.json
REM if %errorlevel% neq 0 exit /b %errorlevel%
