package com.example.qudev.controller;

import com.example.qudev.model.question.*;
import com.example.qudev.model.response.ConnectionDTO;
import com.example.qudev.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Set;


@Controller
public class MainController {

    @Autowired
    SurveyService surveyService;
    @Autowired
    VersionService versionService;
    @Autowired
    QuestionService questionService;
    @Autowired
    OptionService optionService;
    @Autowired
    ResponseService responseService;
    @Autowired
    UserSessionService userSessionService;

    @Value("${spring.datasource.url}")
    private String dbUrl;

    @GetMapping("/")
    public String Home(){
        return "home";
    }

    @GetMapping("/connection")
    public  String Connect(Model model){
        ConnectionDTO res=new ConnectionDTO(dbUrl);
        model.addAttribute("response", res);
        return "connection";
    }

    @GetMapping("/documentation")
    public  String Documentation(){
        return "documentation";
    }

    @GetMapping("/survey-overview")
    public String ShowSurvey(Model model){

        List<Survey> surveys = surveyService.listSurvey();
        List<SurveyVersion> versions = versionService.listVersion();
        List<Question> questions = questionService.listQuestions();
        List<QsOption> options = optionService.listOption();
        List<SurveyResponse> responses = responseService.listResponse();
        List<UserSurveySession> userSessions = userSessionService.listUserSession();

        model.addAttribute("surveys",   surveys);
        model.addAttribute("versions",  versions);
        model.addAttribute("sessions",  userSessions);
        model.addAttribute("questions", questions);
        model.addAttribute("options",   options);
        model.addAttribute("responses", responses);
        return  "survey-view";
    }

    @GetMapping("/demo/user/account/{userId}")
    public String TestingUsers(@PathVariable long userId, Model model){

        model.addAttribute("userId",userId);
        model.addAttribute("surveys",surveyService.listSurvey());
        return "admin-test";
    }

    @GetMapping("/testing/{surveyKey}/{versionId}/demo/user/{userId}")
    public String TestingSurveys(@PathVariable String surveyKey,
                                 @PathVariable long versionId,
                                 @PathVariable long userId, Model model){

        SurveyVersion version = versionService.getVersion(versionId);
        Set<Question> questions = version.getQuestions();
        UserSurveySession userSession = userSessionService.addUserSession(userId,version);
        if(userSession == null){
            return "redirect:/demo/user/account/" + userId;
        }
        model.addAttribute("sessionId",userSession.getId());
        model.addAttribute("questions",questions);
        model.addAttribute("surveyVersionId", versionId);
        return "survey-testing";
    }
}
