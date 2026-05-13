@echo off

cd /D "%~dp0."

if not exist "mirror-Retro-Gaming-Console-ROMs" (
  git clone "https://github.com/warren-bank/mirror-Retro-Gaming-Console-ROMs.git"
)

node "%~dpn0.js"
