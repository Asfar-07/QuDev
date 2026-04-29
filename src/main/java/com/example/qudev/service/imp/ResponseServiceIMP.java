package com.example.qudev.service.imp;

import com.example.qudev.model.question.QsOption;
import com.example.qudev.model.question.Question;
import com.example.qudev.model.question.SurveyResponse;
import com.example.qudev.model.question.UserSurveySession;
import com.example.qudev.model.request.SurveySubmitRequest;
import com.example.qudev.repository.QsOptionRepo;
import com.example.qudev.repository.QuestionRepo;
import com.example.qudev.repository.SessionRepo;
import com.example.qudev.repository.SurveyResponseRepo;
import com.example.qudev.service.ResponseService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResponseServiceIMP implements ResponseService {

    final SurveyResponseRepo surveyResponseRepo;
    final QuestionRepo questionRepo;
    final SessionRepo sessionRepo;
    final QsOptionRepo optionRepo;

    public ResponseServiceIMP(SurveyResponseRepo surveyResponseRepo, QuestionRepo questionRepo, SessionRepo sessionRepo, QsOptionRepo optionRepo) {
        this.surveyResponseRepo = surveyResponseRepo;
        this.questionRepo = questionRepo;
        this.sessionRepo = sessionRepo;
        this.optionRepo = optionRepo;
    }

    @Override
    public List<SurveyResponse> listResponse() {
        return surveyResponseRepo.findAll();
    }

    @Override
    public SurveySubmitRequest saveUserResponse(SurveySubmitRequest request) {

        UserSurveySession session = sessionRepo.findById(request.getSessionId()).orElseThrow(
                ()-> new IllegalArgumentException("not found session"));

        if(request.getResponses() != null){
            request.getResponses().forEach((questionId,content)->{

                Question question = questionRepo.findById(questionId).orElseThrow(
                        ()-> new IllegalArgumentException("not found question"));

                this.filterResponses(session,question,content);

            });
        }
        session.setStatus("Completed");
        session.setFinishedAt(LocalDateTime.now());
        sessionRepo.save(session);

        return null;
    }

    private void filterResponses(UserSurveySession session, Question question,
                                 SurveySubmitRequest.ResponseEntry content){

        switch (question.getType()){

            case SINGLE -> {
                if (content.getSelectedOptionId() != null){
                    QsOption option = optionRepo.findById(content.getSelectedOptionId()).orElse(null);
                    this.saveSingleResponse(session, question, option, null);
                }
            }
            case MULTIPLE -> {
                if (content.getSelectedOptionIds() != null){
                    content.getSelectedOptionIds().forEach((optId )->{
                        QsOption opt = optionRepo.findById(optId).orElse(null);
                        this.saveSingleResponse(session, question, opt, null);
                    });
                }
            }
            case TEXT, SCALE, BOOLEAN -> {
                if (content.getFreeTextValue() != null
                        && !content.getFreeTextValue().isBlank()) {
                    this.saveSingleResponse(session, question, null, content.getFreeTextValue());
                }
            }
        }
    }

    private void saveSingleResponse(UserSurveySession session,
                                    Question question,
                                    QsOption option,
                                    String freeText){

        SurveyResponse response = SurveyResponse.builder()
                .session(session)
                .question(question)
                .selectedOption(option)
                .freeTextValue(freeText)
                .build();

        surveyResponseRepo.save(response);

    }
}
