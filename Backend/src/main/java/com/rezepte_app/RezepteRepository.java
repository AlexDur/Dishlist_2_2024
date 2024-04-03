/*Allgemein: RezepteRepository um effizient Datenzugriffsoperationen für die Rezept-Entitäten zu abstrahieren
 und zu vereinfachen, indem es die komplexen Datenbankoperationen hinter einfachen Methodenaufrufen verbirgt.*/

/*Zur Nutzung des Repositorys kann in Service-Klasse mitells DI eingebunden wurden*/

package com.rezepte_app;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;



/*JpaRepository Interface definiert Methoden (z.B. save(), findById(),...) für CRUD-Operationen und die Paginierung und Sortierung von Entitäten.
* Daher Erbung nützlich*/

/*Annotation signalisiert, dass die Klasse eine Datenzugriffsfunktion hat.*/
@Repository
public interface RezepteRepository extends JpaRepository<Rezept, Integer> {

    List<Rezept> findAllByOrderByIdDesc();
}
