
# AngularTest
## Descripcion de Proyecto

Como  usuario de aplicación de firma  quiero  un componente que me permita posicionar la firma visible  para  que cuando se firme finalmente el documento la representación gráfica coincida con el formato del documento seleccionado.

**Criterios de aceptación**

 - El primer paso consiste en seleccionar un documento en formato PDF
   (cargar archivo).    
 - Se debe previsualizar el documento cargado, y el  usuario sobre este documento puede agregar firmas (rectángulos)    
 - Las  firmas agregadas deben previsualizarse, y pueden posicionarse de
   acuerdo con las siguientes reglas:
    - No pueden superponerse
    - Solo pueden posicionarse en el área del documento (no pueden quedar fuera del documento).
    - El tamaño de la firma es fijo de 130pt x 60pt (puede representarse con un rectángulo)
    - Al presionar Botón "Firmar", El componente debe retornar finalmente un objeto JSON con la referencia al documento a firmar y las posiciones de cada firma (basta con que se despliegue por consola o pantalla el json)

Ej:

    {    
    "documento": "docto.pdf"    
    "firmas": [    
	    {    
	    "nombre": "juan perez",    
	    "pagina": 1,    
	    "posX": 30    
	    "posY": 60    
	    },    
	    {    
	    "nombre": "pedro picapiedra",    
	    "pagina": 1,    
	    "posX": 120    
	    "posY": 60    
		 }    
	    ]   
    }

 - Considerar un documento (PDF) de 1 pagina, si se incluye que permita especificar numero de pagina se considera un plus
-   Considerar zoom fijo del documento, de igual forma si el entregable soporta controles de zoom al documento se considera un plus.
-   El componente debe estar desarrollado en angular (versión 2 hacia arriba) a nivel de POC, todo el posicionamiento se debe hacer del lado cliente (No se debe generar un backend).
-   Se permite el uso de librerías externas o módulos en la medida que no requieran una licencia privativa para su uso. Por ejemplo renderizar el PDF.

## Prerrequisitos

 - NodeJS 18.12.1
 - Angular CLI: 15.0.2 

 ## Ambiente inicial de desarrollo

 - Angular CLI: 15.0.2 
 - Node: 19.01 
 - npm 9.1.3 
 - OS: win32   x64 
 - Angular: 15.0.2

 ## Comando para ejecucion de proyecto
 ### Instalacion de dependencias
     npm install

 ### Ejecucion de proyecto
     ng serve --open
## Instalacion de dependencias

### Angular Material [https://material.angular.io/](https://material.angular.io/)
    ng add @angular/material

### PDFJS-dist [https://github.com/mozilla/pdf.js](https://github.com/mozilla/pdf.js)
    npm i pdfjs-dist

## Nota

 - Se agregan funciones para edicion y eliminacion de firma especifica
 - Se muestra json tanto en la vista como en consola
 - Se agrega dialog para la seleccion de pagina en caso de archivos pdf superiores a 1 pagina
 - Limite maximo para el nombre de firma 10 caracteres