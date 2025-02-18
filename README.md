# Dishlist AI (verfügbar unter www.dish-list.de und im Google Play Store)
Eine Rezepte-App zur Organisation von Online-Rezepten mit integriertem Empfehlungssystem.

Der Nutzer kann Online-Rezepte manuell in der App speichern. Dabei können neben einer Fotoaufnahme auch weitere Details zum Gericht hinzugefügt werden. Die Rezepte können mit Tags versehen werden, die in den folgenden Kategorien unterteilt sind:

- Mahlzeit (Vorspeise, Hauptgericht, Nachspeise)  
- Küche (Deutsch, Italienisch, Japanisch, etc.)  
- Nährwert (proteinreich, kalorienarm, etc.).

Mittels dieser Tags ist eine genauere Beschreibung des Rezepts möglich, welche das Filtern der bereits angelegten Rezepts erlaubt.
Gespeicherte Rezepte können in einer Übersicht angezeigt und mithilfe der gesetzten Tags gefiltert werden.

Beim Setzen eines oder mehrerer Filter aus den drei Kategorien kann der Nutzer künftig per Knopfdruck drei Rezepte empfohlen bekommen, die den gewählten Kriterien entsprechen. Die Empfehlungslogik basiert auf Content-based Filtering – einer Methode im Bereich der künstlichen Intelligenz (KI). Dabei werden die Tags der gefilterten Rezepte mit den Attributen in einer angebundenen API (Spoontastic) abgeglichen, um passende Vorschläge zu ermitteln und dem Nutzer anzuzeigen.

Beispiel: Wenn der Nutzer die Filter "Hauptgericht", "Japanisch" und "proteinreich" auswählt, wird die Empfehlungslogik drei Rezepte vorschlagen, die diese drei Attribute enthalten. Die übereinstimmenden Rezepte werden dann dem Nutzer präsentiert. Bei einer größeren Anzahl an passenden Rezepten wird stets eine zufällige Auswahl von drei Rezepten getroffen.

Es würden dann etwa diese Rezepte empfohlen werden:

1. Teriyaki-Lachs mit scharfen Jade-Nudeln | 2. Tonkatsu mit gerösteten Wasabi-Kartoffeln | 3. Chicken Katsu im süß-sauren Schlachtfeld 

Guten Appetit!





____


**Verwendete Technologien**

- Angular
- Spring Boot
- MySQL
- AWS: Lightsail, S3, RDS, Cognito, Weitere
  
