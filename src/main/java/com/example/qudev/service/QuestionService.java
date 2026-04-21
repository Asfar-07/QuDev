package com.example.qudev.service;


import com.example.qudev.model.request.QuestionRequest;

public interface QuestionService {

    void saveQuestion(Long versionId, QuestionRequest request);
    void collectQuestion(long versionId);
}
