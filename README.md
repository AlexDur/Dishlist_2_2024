# Dishlist_2024
Eine Rezepte-App zur Organisation von Online-Rezepten mit integriertem Empfehlungssystem.

Der Nutzer kann Online-Rezepte manuell in der App speichern. Dabei können neben einer Fotoaufnahme auch weitere Details zum Gericht hinzugefügt werden. Die Rezepte können mit Tags versehen werden, die in den folgenden Kategorien unterteilt sind:

Mahlzeit (Vorspeise, Hauptgericht, Nachspeise),
Küche (Deutsch, Italienisch, Japanisch, etc.),
Nährwert (proteinreich, kalorienarm, etc.).

Dank dieser Tags ist eine genauere Beschreibung des Gerichts möglich.

Gespeicherte Gerichte können in einer Übersicht angezeigt und mithilfe der gesetzten Tags gefiltert werden.

Beim Setzen eines oder mehrerer Filter aus den drei Kategorien wird es dem Nutzer künftig möglich sein, per Knopfdruck drei Gerichte empfohlen zu bekommen, die den gewählten Filterkriterien entsprechen.

Die Empfehlungslogik basiert auf Content-based Filtering – einer Methode im Bereich der künstlichen Intelligenz (KI). Dadurch werden für die Tags der gefilterten Rezepte inhaltliche Entsprechungen innerhalb einer angebundenen API (Spoontastic) ermittelt und als passende Vorschläge ausgegeben.

Beispiel: Wenn der Nutzer die Filter "Hauptgericht", "Japanisch" und "proteinreich" auswählt, wird die Empfehlungslogik drei Rezepte vorschlagen, die diese drei Attribute enthalten. Die übereinstimmenden Rezepte werden dann dem Nutzer präsentiert. Bei einer größeren Anzahl an passenden Rezepten wird eine zufällige Auswahl von drei Rezepten getroffen.

Das Ergebnis könnte dann lauten:

Teriyaki-Lachs
Chicken Katsu
Tonkatsu

Guten Appetit!
