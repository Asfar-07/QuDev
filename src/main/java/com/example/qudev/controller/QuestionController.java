package com.example.qudev.controller;

import com.example.qudev.model.question.Survey;
import com.example.qudev.service.QuestionService;
import com.example.qudev.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@Controller
public class QuestionController {

    @Autowired
    QuestionService questionService;
    @Autowired
    SurveyService surveyService;

    @GetMapping("/questions/{surveyId}/{versionId}")
    public String question(Model model, @PathVariable String surveyId,
                           @PathVariable long versionId){
        Survey survey=surveyService.getSurvey(surveyId);
        model.addAttribute("survey",survey);
//        questionService.collectQuestion(versionId);
        return "questions";
    }

}
