package com.example.qudev.model.request;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class SurveySubmitRequest {

    private Long sessionId;

    private Long surveyVersionId;

    private Map<Long, ResponseEntry> responses;

    @Data
    public static class ResponseEntry {

        private Long selectedOptionId;

        private List<Long> selectedOptionIds;

        private String freeTextValue;
    }
}
