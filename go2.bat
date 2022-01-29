@echo off
call yarn cli --file input.txt --output ./recipes-full.json %*
copy /Y recipes-full.json ..\recipes-react-app\src\recipes-full.json
