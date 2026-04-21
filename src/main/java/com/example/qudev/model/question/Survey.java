package com.example.qudev.model.question;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table( name = "surveys")
public class Survey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(name="survey_key",nullable = false, updatable = false, unique = true)
    private String key;

    @Lob
    @Column(nullable = false)
    private String description;

    private boolean active=true;

    @OneToMany(mappedBy = "survey", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SurveyVersion> versions = new ArrayList<>();


}
