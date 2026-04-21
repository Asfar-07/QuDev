package com.example.qudev.service;

import com.example.qudev.model.question.Survey;
import com.example.qudev.model.request.UpdateSurvey;

import java.util.List;

public interface SurveyService {

    List<Survey> listSurvey();
    void addNewSurvey(Survey survey);
    void updateSurvey(String id, UpdateSurvey request);
}
