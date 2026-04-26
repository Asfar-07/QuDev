package com.example.qudev.service.imp;

import com.example.qudev.model.question.SurveyResponse;
import com.example.qudev.repository.SurveyResponseRepo;
import com.example.qudev.service.ResponseService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResponseServiceIMP implements ResponseService {

    final SurveyResponseRepo surveyResponseRepo;

    public ResponseServiceIMP(SurveyResponseRepo surveyResponseRepo) {
        this.surveyResponseRepo = surveyResponseRepo;
    }

    @Override
    public List<SurveyResponse> listResponse() {
        return surveyResponseRepo.findAll();
    }
}
