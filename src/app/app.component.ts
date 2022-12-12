import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as pdfjsLib from 'pdfjs-dist';
import { AppDialogPageComponent } from './app-dialog-page/app-dialog-page.component';

pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js';
export interface DialogData {
  pagina: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  pdfUrl: string = '';
  showFirmar: Boolean = false;
  last_mousex: number = 0;
  last_mousey: number = 0;
  mousex: number = 0;
  mousey: number = 0;
  posInvalida = false;
  posInvalidaMensaje: string = '';
  docFirma: any = {
    documento: '',
    firmas: []
  };
  jsonResult: any;
  nroFirmas: number = 0;
  rectWidth: number = 173; //130pt
  rectHeight: number = 80; //60pt
  paginaSelecionada: number = 1;

  constructor(public dialog: MatDialog) {
  }

  /**
   * Carga de Archivo PDF 
   * @param fileInputEvent 
   */
  uploadFile(fileInputEvent: any) {
    this.pdfUrl = encodeURI(URL.createObjectURL(fileInputEvent.target.files[0]));
    const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
    loadingTask.promise.then((pdf) => {
      if (pdf.numPages == 1)
        this.renderPDF(1);
      else
        this.openDialog(pdf.numPages);
    })
    this.docFirma.documento = "";
    this.docFirma.firmas = [];
    this.posInvalida = false;
    this.docFirma.documento = fileInputEvent.target.files[0].name;
  }

  /**
   * Despliega dialog para la seleccion de numero de pagina a renderizar
   * Si es 1 pagina no se despliega
   * @param pagina numero de pagnas del pdf
   */
  openDialog(pagina: number) {
    let dialogRef: MatDialogRef<AppDialogPageComponent>;
    dialogRef = this.dialog.open(AppDialogPageComponent, { disableClose: true });
    dialogRef.componentInstance.pagina = pagina;
    dialogRef.afterClosed().subscribe(result => {
      this.paginaSelecionada = result;
      this.renderPDF(result);
    });
  }

  /**
   * Renderiza la pagina seleccionada del pdf en un canvas 
   * @param page numero de pagina seleccionada
   */
  renderPDF(page: number) {
    this.clearSignature()
    const loadingTask = pdfjsLib.getDocument(this.pdfUrl);
    loadingTask.promise.then((pdf) => {
      var pageNumber = page;
      pdf.getPage(pageNumber).then(function (page) {
        var scale = 1;
        var viewport = page.getViewport({ scale: scale });
        var canvasPDF: any = document.getElementById('pdf');
        var canvasFirmas: any = document.getElementById("firmas");
        var contextPDF = canvasPDF.getContext('2d');
        canvasPDF.height = viewport.height;
        canvasPDF.width = viewport.width;
        canvasFirmas.height = viewport.height;
        canvasFirmas.width = viewport.width;

        page.render({
          canvasContext: contextPDF,
          viewport: viewport
        });
      },
        error => {
          throw error;
        });
      this.nroFirmas = 0;
    },
      error => {
        throw error;
      },).finally(() => {
        this.showFirmar = true;
        this.createMouseClickEvent();
      });

  }

  /**
   * Permite la modificacion del nombre de la firma
   * edita el nombre de la firma seleccionada y actualiza el canvas de firmas 
   * @param nombre nuevo nombre de la firma
   * @param index posicion en el array de firmas
   */
  changeSignature(nombre: string, index: number) {

    var topCanvas: any = document.getElementById('firmas');
    var ctx = topCanvas.getContext('2d');
    ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);

    this.docFirma.firmas[index].nombre = nombre
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.font = "20px Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";

    for (let firma of this.docFirma.firmas) {
      ctx.beginPath();
      ctx.rect(firma.posX, firma.posY, this.rectWidth, this.rectHeight);
      ctx.stroke();
      ctx.fillText(firma.nombre, firma.posX + (this.rectWidth / 2), firma.posY + (this.rectHeight / 2));
    }

    this.clearSignature()
  }

  /**
 * Permite la eliminacion de una firma 
 * elimina la firma seleccionada y actualiza el canvas de firmas 
 * @param index posicion en el array de firmas
 */
  deleteSignature(index: number) {
    var topCanvas: any = document.getElementById('firmas');
    var ctx = topCanvas.getContext('2d');
    ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);

    this.docFirma.firmas.splice(index, 1)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.font = "20px Roboto";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";

    for (let firma of this.docFirma.firmas) {
      ctx.beginPath();
      ctx.rect(firma.posX, firma.posY, this.rectWidth, this.rectHeight);
      ctx.stroke();
      ctx.fillText(firma.nombre, firma.posX + (this.rectWidth / 2), firma.posY + (this.rectHeight / 2));
    }

    this.clearSignature()
  }

  /**
   * Publicar JSON con los datos de la firma del documento 
   */
  singDocument() {
    console.log(JSON.stringify(this.docFirma, null, 4))
    this.jsonResult = JSON.stringify(this.docFirma, null, 4)
  }
  /**
   * Limpia el dato publicado de la firma
   */
  clearSignature() {
    this.jsonResult = ""
  }

  /**
   * Se crea un listener para el manejo del click donde se desea colocar la firma 
   */
  createMouseClickEvent() {
    var canvas: any = document.getElementById('firmas');
    canvas.addEventListener("mousedown", this.handleMouseClick);
  }

  /**
   * Genera firma al hacer click sobre el canvas
   * verifica que no hayan problemas de superposicion o dibujado fuera de los limites 
   * @param ev MouseEvent
   */
  private handleMouseClick = (ev: MouseEvent) => {
    var canvas: any = document.getElementById('firmas');
    var ctx = canvas.getContext('2d');
    var pos = this.getCursorPosition(ev);
    this.last_mousex = pos.x;
    this.last_mousey = pos.y;

    var maxX = canvas.width - this.rectWidth;
    var maxY = canvas.height - this.rectHeight;

    for (let firma of this.docFirma.firmas) {

      /**
       * Se revisa la posicion en busca de superposiciones con otras firmas o fuera de documento
       * en caso de no haber se dibuja la firma y se anexa al array firmas
       */
      // Superposicion +X - -Y
      if ((this.last_mousex >= firma.posX && this.last_mousex <= (firma.posX + this.rectWidth)) &&
        (this.last_mousey >= firma.posY && this.last_mousey <= (firma.posY + this.rectHeight))) {
        this.posInvalida = true;
        this.posInvalidaMensaje = "Posicion Invalida superpone firma: " + firma.nombre;
      }

      // Superposicion -X - +Y
      if (((this.last_mousex + this.rectWidth) >= firma.posX && (this.last_mousex + this.rectWidth) <= (firma.posX + this.rectWidth)) &&
        ((this.last_mousey + this.rectHeight) >= firma.posY && (this.last_mousey + this.rectHeight) <= (firma.posY + this.rectHeight))) {
        this.posInvalida = true;
        this.posInvalidaMensaje = "Posicion Invalida superpone firma: " + firma.nombre;
      }

      // Superposicion +X - +Y
      if (((this.last_mousex) >= firma.posX && (this.last_mousex) <= (firma.posX + this.rectWidth)) &&
        ((this.last_mousey + this.rectHeight) >= firma.posY && (this.last_mousey + this.rectHeight) <= (firma.posY + this.rectHeight))) {
        this.posInvalida = true;
        this.posInvalidaMensaje = "Posicion Invalida superpone firma: " + firma.nombre;
      }

      // Superposicion -X - -Y
      if (((this.last_mousex + this.rectWidth) >= firma.posX && (this.last_mousex + this.rectWidth) <= (firma.posX + this.rectWidth)) &&
        ((this.last_mousey) >= firma.posY && (this.last_mousey) <= (firma.posY + this.rectHeight))) {
        this.posInvalida = true;
        this.posInvalidaMensaje = "Posicion Invalida superpone firma: " + firma.nombre;
      }
    }
    if (this.last_mousex > maxX || this.last_mousey > maxY) {
      alert("Posicion Invalida fuera de limites \n" + this.posInvalidaMensaje);
    } else if (this.posInvalida) {
      alert(this.posInvalidaMensaje)
    } else {
      this.nroFirmas++;
      ctx.beginPath();
      ctx.rect(this.last_mousex, this.last_mousey, this.rectWidth, this.rectHeight);
      ctx.stroke();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.font = "20px Roboto";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000";
      ctx.fillText("Firma" + this.nroFirmas.toLocaleString(undefined, { minimumIntegerDigits: 2 }), this.last_mousex + (this.rectWidth / 2), this.last_mousey + (this.rectHeight / 2));

      this.docFirma.firmas.push({
        nombre: "Firma" + this.nroFirmas.toLocaleString(undefined, { minimumIntegerDigits: 2 }),
        pagina: this.paginaSelecionada,
        posX: this.last_mousex,
        posY: this.last_mousey
      });

    }
    this.posInvalida = false;
    this.posInvalidaMensaje = ""
    this.clearSignature()
  }

  /**
   * Metodo para la obtencion de la posicion actual del curso en relacion al canvas
   * @param ev  MouseEvent
   * @returns { x, y } Posiciones en ekje X y Y
   */
  getCursorPosition(ev: MouseEvent) {
    var canvas: any = document.getElementById('firmas');
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    return { x, y };
  }
}
