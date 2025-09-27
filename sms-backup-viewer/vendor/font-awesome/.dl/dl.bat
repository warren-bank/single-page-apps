@echo off

set DIR=%~dp0..
wget -nv -nc --no-check-certificate -P "%DIR%" -i "%~dp0.\urls.txt" >"%~dpn0.log" 2>&1

set css="%~dp0..\css"
mkdir %css%
mv "%DIR%\all.min.css" %css%

set webfonts="%~dp0..\webfonts"
mkdir %webfonts%
mv "%DIR%\fa-solid-900.woff2" %webfonts%
mv "%DIR%\fa-solid-900.ttf"   %webfonts%
