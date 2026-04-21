package com.example.qudev.controller;

import com.example.qudev.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@Controller
public class QuestionController {

    @Autowired
    QuestionService questionService;

    @GetMapping("/questions/{surveyId}/{versionId}")
    public String question(@PathVariable String surveyId,
                           @PathVariable long versionId){
//        questionService.collectQuestion(versionId);
        return "questions";
    }

}
