@echo off

wget -nv -nc --no-check-certificate -P "%~dp0.." -i "%~dp0.\urls.txt" >"%~dpn0.log" 2>&1
