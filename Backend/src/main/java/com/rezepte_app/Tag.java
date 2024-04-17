package com.rezepte_app;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name ="tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message="Label muss vorhanden sein")
    private String label;

    @NotBlank(message = "Severity muss vorhanden sein")
    private String severity;

    @ManyToOne // Many tags can belong to one recipe
    @JoinColumn(name = "rezept_id") // Foreign key to the recipe table
    private Rezept rezept; // Reference to the recipe this tag belongs to

    public Tag() {
        // Standardkonstruktor ohne Parameter ist für JPA erforderlich
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Rezept getRezept() {
        return rezept;
    }

    public void setRezept(Rezept rezept) {
        this.rezept = rezept;
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
