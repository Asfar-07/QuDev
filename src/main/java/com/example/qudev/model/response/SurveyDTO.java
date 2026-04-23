package com.example.qudev.model.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SurveyDTO {

    private long id;
    private String name;
    private String key;
    private String description;
    private boolean active;
}
