package com.example.qudev.service.imp;

import com.example.qudev.model.question.QsOption;
import com.example.qudev.model.question.Question;
import com.example.qudev.model.question.SurveyVersion;
import com.example.qudev.model.request.OptionRequest;
import com.example.qudev.model.request.QuestionRequest;
import com.example.qudev.repository.QuestionRepo;
import com.example.qudev.repository.SurveyVersionRepo;
import com.example.qudev.service.QuestionService;
import org.springframework.stereotype.Service;

@Service
public class QuestionServiceIMP implements QuestionService {
    final SurveyVersionRepo surveyVersionRepo;
    final QuestionRepo questionRepo;

    public QuestionServiceIMP(SurveyVersionRepo surveyVersionRepo, QuestionRepo questionRepo) {
        this.surveyVersionRepo = surveyVersionRepo;
        this.questionRepo = questionRepo;
    }

    @Override
    public void collectQuestion(long versionId) {
        SurveyVersion version=surveyVersionRepo.fetchFullVersion(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        System.out.println(version);
    }

    @Override
    public void saveQuestion(Long versionId, QuestionRequest request) {
        SurveyVersion version = surveyVersionRepo.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));

        Question question= Question.builder()
                .order(request.getOrder())
                .question_text(request.getQuestionText())
                .question_key(request.getQuestionKey())
                .type(request.getType())
                .required(request.isRequired())
                .surveyVersion(version) // link with id
                .active(true)
                .build();

        if(request.getOptions() != null &&
                (request.getType() == Question.Type.SINGLE
                        || request.getType() == Question.Type.MULTIPLE)){

            int order=0;
            for (OptionRequest opt : request.getOptions()) {

                QsOption option=QsOption.builder()
                        .option_key(opt.getKey())
                        .option_text(opt.getLabel())
                        .order(order++)
                        .question(question) // link with id
                        .active(true)
                        .build();
                question.addOption(option);
            }
        }
        questionRepo.save(question);
    }


}
