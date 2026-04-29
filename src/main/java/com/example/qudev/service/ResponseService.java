package com.example.qudev.service;

import com.example.qudev.model.question.SurveyResponse;
import com.example.qudev.model.request.SurveySubmitRequest;

import java.util.List;

public interface ResponseService {

    List<SurveyResponse> listResponse();
    SurveySubmitRequest saveUserResponse(SurveySubmitRequest request);
}
