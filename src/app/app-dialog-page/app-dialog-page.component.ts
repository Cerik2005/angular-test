import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppComponent, DialogData } from '../app.component';

@Component({
  selector: 'app-app-dialog-page',
  templateUrl: './app-dialog-page.component.html',
  styleUrls: ['./app-dialog-page.component.css']
})
export class AppDialogPageComponent {
  pagina!: number;
  constructor(
    public dialogRef: MatDialogRef<AppDialogPageComponent>,
  ) { }

  /**
   * Retorno de numero de pagina seleccionado
   * @param pagina 
   */
  loadPDF(pagina: string) {
    this.dialogRef.close(Number(pagina));
  }
}
