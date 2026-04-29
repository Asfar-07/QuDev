package com.example.qudev.model.question;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table( name = "survey_responses")
public class SurveyResponse  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // which session
    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private UserSurveySession session;

    // which question
    @ManyToOne
    @JoinColumn(name = "q_id", nullable = false)
    private Question question;

    // selected option (nullable for text/rating)
    @ManyToOne
    @JoinColumn(name = "opt_id")
    private QsOption selectedOption;

    // text or rating value
    @Column(columnDefinition = "TEXT")
    private String freeTextValue;
}

