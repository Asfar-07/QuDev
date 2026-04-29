package com.example.qudev.controller;
import com.example.qudev.model.request.QuestionRequest;
import com.example.qudev.model.request.SurveySubmitRequest;
import com.example.qudev.model.request.UpdateSurvey;
import com.example.qudev.service.QuestionService;
import com.example.qudev.service.ResponseService;
import com.example.qudev.service.SurveyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.List;

@RestController
public class ApiController {
    private final DataSource dataSource;

    @Autowired
    SurveyService surveyService;

    @Autowired
    QuestionService questionService;

    @Autowired
    ResponseService responseService;

    public ApiController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/check-db")
    public String checkDb() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                return "DB Connection SUCCESS";
            } else {
                return "DB Connection FAILED";
            }
        } catch (Exception e) {
            return " DB Connection FAILED: " + e.getMessage();
        }
    }

    @PutMapping("/update/survey/{id}")
    public ResponseEntity<String> updateSurvey(@PathVariable String id,
                                       @RequestBody UpdateSurvey request){

        surveyService.updateSurvey(id,request);
        return  ResponseEntity.ok("ok");
    }

    @DeleteMapping("/delete/survey/{id}")
    public ResponseEntity<String> DeleteSurvey(@PathVariable long id){

        System.out.println(id);
        surveyService.deleteSurvey(id);
        return ResponseEntity.ok("ok");
    }


    @PostMapping("/new/question/{versionId}")
    public ResponseEntity<String> AddQuestion( @PathVariable Long versionId,
                                               @RequestBody QuestionRequest request){

        questionService.saveQuestion(versionId,request);
        return  ResponseEntity.ok("ok");
    }

    @PutMapping("/update/question")
    public ResponseEntity<String> UpdateQuestion(@RequestBody List<QuestionRequest> req,
                                                 @RequestParam(name="createNewVersion") boolean isNewVersion){

        questionService.updateQuestion(req,isNewVersion);
        return ResponseEntity.ok("ok");
    }

    @DeleteMapping("/delete/question")
    public  ResponseEntity<String> DeleteQuestion(@RequestBody List<Long> questionIds,
                                                  @RequestParam(name="createNewVersion") boolean isNewVersion){

        questionService.delectQuestion(questionIds,isNewVersion);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/survey/user/response")
    public ResponseEntity<String> SurveyResponse(@RequestBody SurveySubmitRequest request){

        System.out.println(request);
        responseService.saveUserResponse(request);
        return ResponseEntity.ok("ok");
    }
}
