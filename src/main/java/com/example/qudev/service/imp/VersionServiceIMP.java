package com.example.qudev.service.imp;

import com.example.qudev.model.question.SurveyVersion;
import com.example.qudev.repository.SurveyVersionRepo;
import com.example.qudev.service.VersionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VersionServiceIMP implements VersionService {

    final SurveyVersionRepo surveyVersionRepo;

    public VersionServiceIMP(SurveyVersionRepo surveyVersionRepo) {
        this.surveyVersionRepo = surveyVersionRepo;
    }

    @Override
    public List<SurveyVersion> listVersion() {
        return surveyVersionRepo.findAll();
    }
}
