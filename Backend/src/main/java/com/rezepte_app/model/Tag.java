package com.rezepte_app.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name ="tags")
@Data // Generiert Getter, Setter, toString, equals, hashCode
@NoArgsConstructor //Generiert einen Standardkonstruktor
public class Tag{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message="Label muss vorhanden sein")
    private String label;

    @NotBlank(message="Typ muss vorhanden sein")
    private String type;

    @ManyToMany(mappedBy = "tags")
      // Verhindert die Serialisierung dieser Seite der Beziehung
    @JsonIgnore
    private Set<Rezept> rezepte = new HashSet<>();

    @Transient // Markiert das Feld als nicht dauerhaft
    private int count;

    // Methode zum Setzen des count-Wertes
    public void updateCount() {
        this.count = rezepte != null ? rezepte.size() : 0;
    }

    // Optional: Getter für count, der den count-Wert immer aktualisiert
    public int getCount() {
        updateCount();
        return count;
    }

    public String getLabel() {
        return label;
    }

    public int getId() {
        return Math.toIntExact((long) id);
    }

    public List<Tag> getTags() {
        List<Tag> tags = List.of();
        return tags;
    }

    public void setLabel(String label) {
        this.label = label;
    }


    /*Zur Vermeidung von doppelten Objekten*/
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tag)) return false;
        Tag tag = (Tag) o;
        return id == tag.id;
    }

    /*Zur Orga von Objekten in Hashtabellen (=>schnelle Suche und Zugriff auf Objekte möglich)*/
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }



}
