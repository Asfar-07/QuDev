package com.example.qudev.controller;

import com.example.qudev.model.question.Survey;
import com.example.qudev.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class SurveysController {

    @Autowired
    SurveyService surveyService;

    @GetMapping("/surveys")
    public  String getSurvey(Model model){
        List<Survey> listSurvey=surveyService.listSurvey();
        Survey survey=new Survey();
        model.addAttribute("survey", survey); //for form
        model.addAttribute("listSurvey", listSurvey);
        return "surveys";
    }

    @PostMapping("/add/surveys")
    public String addSurvey(Survey survey, Model model){
        surveyService.addNewSurvey(survey);
        return "redirect:/surveys";
    }

    @DeleteMapping("/delete/survey")
    public void deleteSurvey(){

    }

}
