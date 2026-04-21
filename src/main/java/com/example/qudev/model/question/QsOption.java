package com.example.qudev.model.question;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
@Entity
@Table( name = "qs_options")
public class QsOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "q_id", nullable = false)
    private Question question;

    @Column(name = "op_order", nullable = false)
    private int order;

    @Column( updatable = false, nullable = false)
    private String option_key;

    @Column( nullable = false)
    private String option_text;

    @Column( nullable = false)
    private boolean active;

    @OneToMany(mappedBy = "selectedOption", cascade = CascadeType.ALL)
    private List<SurveyResponse> responses=new ArrayList<>();

}
