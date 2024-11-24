import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {Rezept} from "../models/rezepte";
import {RezeptService} from "../services/rezepte.service";


@Component({
  selector: 'app-listen-container',
  templateUrl: './listen-container.component.html'
})

export class ListenContainerComponent implements OnInit{
  @Input() isMobile?: boolean;
  rezepteGeladen: EventEmitter<Rezept[]> = new EventEmitter<Rezept[]>();
  rezepte: Rezept[] = [];
  rezepteVerfuegbar = false
  gefilterteRezepte: Rezept[] = [];
  bildUrls: { [key: number]: string } = {};

  constructor(private rezepteService: RezeptService) {}

  ngOnInit(): void {
    this.rezepteService.getAlleRezepte().subscribe(rezepte => {
      this.rezepte = rezepte.map(rezept => ({
        ...rezept,
   /*     datum: rezept.datum ? new Date(rezept.datum) : undefined*/
      }));
      this.rezepteGeladen.emit(this.rezepte); // Sendet die geladenen Rezepte an Kinderkomponenten
      this.gefilterteRezepte = [...this.rezepte]; // Initialisiere gefilterte Rezepte mit allen Rezepten
      this.rezepteVerfuegbar = true;
      console.log('rezepteVerfügbar', this.rezepteVerfuegbar);

      // Bilder für jedes Rezept abrufen
      this.gefilterteRezepte.forEach(rezept => {
        if (rezept.bildUrl) {
          // Bildname extrahieren (z.B. nur den letzten Teil der URL)
          const bildname = rezept.bildUrl.split('/').pop(); // Beispiel für Windows-Pfad
          console.log('bildname', bildname)
          if (bildname) {
            this.rezepteService.getBild(bildname).subscribe(response => {
              if (response.body) {
              /*  const blob = new Blob([response.body], { type: 'image/png' });*/
                const imageUrl = `https://bonn-nov24.s3.eu-central-1.amazonaws.com/${bildname}`;
                this.bildUrls[rezept.id] = imageUrl;
                console.log(' Bild-URL speichern')
              } else {
                //Anfrage zum Bildabruf erfolgreich, aber kein gültiges Bild zurückgegeben
                console.warn(`Bild nicht gefunden für Rezept-ID: ${rezept.id}`);
              }
            }, error => {
              //Fehler, wenn während der Kommunikation mit dem Server/S3 eine Fehler auftritt
              console.error(`Fehler beim Abrufen des Bildes für Rezept-ID: ${rezept.id}`, error);
            });
          } else {
            //Extraktion des Bildnamens aus einem Rezept-Objekt schlägt fehl
            console.warn(`Bildname konnte nicht extrahiert werden für Rezept-ID: ${rezept.id}`);
          }
        }
      });
    });
  }

  onRezepteFiltered(rezepte: Rezept[]): void {
    console.log('Geladene Rezepte im Kindkomponente:', rezepte);
    this.gefilterteRezepte = rezepte;
    // Hier können Sie die geladenen Rezepte weiterverarbeiten, z.B. anzeigen oder in einer Eigenschaft speichern
  }


}


