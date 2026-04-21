package com.example.qudev.model.request;

import com.example.qudev.model.question.Question;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class QuestionRequest {
    private String questionKey;
    private String questionText;
    private Question.Type type;
    private int order;
    private boolean required;

    private List<OptionRequest> options;
}
