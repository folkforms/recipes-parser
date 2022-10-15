@echo off

call C:\Users\Alan\AppData\Roaming\npm\yarn.cmd cli --input f:/documents/food/**/*.md --output ./recipes-full.json %*
if %errorlevel% neq 0 exit /b %errorlevel%
copy /Y recipes-full.json ..\recipes-react-app\src\recipes-full.json
if %errorlevel% neq 0 exit /b %errorlevel%
