package com.rezepte_app.dto;

import com.rezepte_app.model.TagType;

public class TagDTO {
    private Long id;
    private String type;
    private String label;
    private boolean selected;
    private int count;

    public TagDTO() {}

    public TagDTO(Long id, String type, String label, boolean selected, int count) {
        this.id = id;
        this.type = type;
        this.label = label;
        this.selected = selected;
        this.count = count;
    }

    public Long getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public String getLabel() {
        return label;
    }

    public boolean isSelected() {
        return selected;
    }

    public int getCount() {
        return count;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setType(TagType  type) {
        this.type = String.valueOf(type);
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
