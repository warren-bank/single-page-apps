@echo off

set URL="https://difflists.com/index.html"

set opts=
set opts=%opts% -P "%~dp0.."
set opts=%opts% -p -np -nH
set opts=%opts% --no-check-certificate
set opts=%opts% -e robots=off

wget %opts% %URL% >"%~dpn0.log" 2>&1
