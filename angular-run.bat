REM Proceso bat que ejecucion de app.
@echo off

REM Se posiciona en el directorio del proyecto.
CD /D %~dp0

cls
@echo off
REM MODE con:cols=80 lines=40
color 07

:inicio
SET var=0

REM Obtiene IP local.
REM for /f "tokens=1-2 delims=:" %%a in ('ipconfig^|find "IPv4"') do set ip=%%b
REM set ip=%ip:~1%
set ip=localhost

cls
echo ------------------------------------------------------------------------------
echo "     _   _  _  ___ _   _ _      _   ___    _____ ___ ___ _____              "
echo "    /_\ | \| |/ __| | | | |    /_\ | _ \__|_   _| __/ __|_   _|             "
echo "   / _ \| .` | (_ | |_| | |__ / _ \|   /___|| | | _|\__ \ | |               "
echo "  /_/ \_\_|\_|\___|\___/|____/_/ \_\_|_\    |_| |___|___/ |_|               "                                                              
echo "                                                                            "
echo.
echo  %DATE% ^| %TIME%
echo ------------------------------------------------------------------------------
echo  0    Opcion 0 - Instalar dependencias (npm install).
echo  1    Opcion 1 - Ejecutar en modo LOCAL      (%ip%).
echo  5    Salir
echo ------------------------------------------------------------------------------
echo.

SET /p var= ^> Seleccione una opcion : 

if "%var%"=="0" goto op0
if "%var%"=="1" goto op1
if "%var%"=="5" goto salir

::Mensaje de error, validación cuando se selecciona una opción fuera de rango
echo. El numero "%var%" no es una opcion valida, por favor intente de nuevo.
echo.
pause
echo.
goto:inicio

:op0
    echo.
    echo. =^> Has elegido la opcion No. 0 (instalar dependencias)
    echo.
        color 07
        echo. =^> Se inicia la instalacion de dependencias.
		npm install
		echo.
		color 07

:op1
    echo.
    echo. =^> Has elegido la opcion No. 1 (ejecucion local)
    echo.
        color 02
        echo. =^> Se inicia la compilacion del proyecto Angular.
		ng serve --host %ip% --port 4200
		echo.
		color 02

:salir
    @cls&exit