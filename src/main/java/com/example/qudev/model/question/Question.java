package com.example.qudev.model.question;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table( name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column( name="q_order", nullable = false)
    private int order;

    @Column( nullable = false)
    private String question_key;//text id eg:feature_rating,cancel_reason

    @Column( nullable = false)
    private String question_text; //real text

    @Enumerated(EnumType.STRING)
    @Column( nullable = false)
    private Type type; //what type question eg:single,multi,rating

    @Column( nullable = false)
    private boolean required; //optional

    @Column( nullable = false)
    private boolean active;

    @ManyToOne
    @JoinColumn(name = "ver_id", nullable = false)
    private SurveyVersion surveyVersion;

    @OneToMany( mappedBy = "question",cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<QsOption> option = new HashSet<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private Set<SurveyResponse> responses=new HashSet<>();

    public enum Type {
        SINGLE, MULTIPLE, TEXT, SCALE, BOOLEAN
    }
    public void addOption(QsOption opt) {
        if (option == null) {
            option = new HashSet<>();
        }
        option.add(opt);
        opt.setQuestion(this);
    }
}

