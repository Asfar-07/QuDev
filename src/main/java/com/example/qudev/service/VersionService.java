package com.example.qudev.service;

import com.example.qudev.model.question.SurveyVersion;

import java.util.List;

public interface VersionService {

    List<SurveyVersion> listVersion();
    SurveyVersion getVersion(long versionId);
}
