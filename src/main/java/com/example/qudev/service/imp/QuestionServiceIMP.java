package com.example.qudev.service.imp;

import com.example.qudev.model.question.QsOption;
import com.example.qudev.model.question.Question;
import com.example.qudev.model.question.Survey;
import com.example.qudev.model.question.SurveyVersion;
import com.example.qudev.model.request.OptionRequest;
import com.example.qudev.model.request.QuestionRequest;
import com.example.qudev.model.response.OptionResponse;
import com.example.qudev.model.response.QuestionResponse;
import com.example.qudev.model.response.SurveyVersionResponse;
import com.example.qudev.repository.QuestionRepo;
import com.example.qudev.repository.SurveyVersionRepo;
import com.example.qudev.service.QuestionService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuestionServiceIMP implements QuestionService {
    final SurveyVersionRepo surveyVersionRepo;
    final QuestionRepo questionRepo;

    public QuestionServiceIMP(SurveyVersionRepo surveyVersionRepo, QuestionRepo questionRepo) {
        this.surveyVersionRepo = surveyVersionRepo;
        this.questionRepo = questionRepo;
    }

    @Override
    public SurveyVersionResponse collectQuestion(long versionId) {
        SurveyVersion version = surveyVersionRepo.fetchFullVersion(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        SurveyVersionResponse response= new SurveyVersionResponse();
        response.setVersionId(version.getId());

        //collect question and options
        List<QuestionResponse> questionList = version.getQuestions()
                .stream()
                .sorted(Comparator.comparing(Question::getOrder)) // arranging in order
                .map(qu->{
                    QuestionResponse quResponse = QuestionResponse.builder()
                            .id(qu.getId())
                            .key(qu.getQuestion_key())
                            .text(qu.getQuestion_text())
                            .type(qu.getType().name())
                            .required(qu.isRequired())
                            .build();

                    //collect option each question
                    List<OptionResponse> options = qu.getOption().
                            stream()
                            .sorted(Comparator.comparing(QsOption::getOrder)) // arranging in order
                            .map(opt ->{
                                return OptionResponse.builder()
                                        .key(opt.getOption_key())
                                        .label(opt.getOption_text())
                                        .build();
                            })
                            .toList();

                    quResponse.setOptions(options);
                    return  quResponse;
                })
                .toList();

        response.setQuestions(questionList);
        return response;
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

            int order=1;
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
    @Override
    @Transactional
    public void updateQuestion( List<QuestionRequest> requests, boolean createNewVersion) {
        if (requests == null || requests.isEmpty()) return;

        List<String> keys = requests.stream()
                .map(QuestionRequest::getQuestionKey)
                .toList();

        Question oldQuestion = questionRepo.findById(requests.getFirst().getId()).orElse(null);
        assert oldQuestion != null;
        SurveyVersion oldVersion = oldQuestion.getSurveyVersion();
        
        if (createNewVersion){

            SurveyVersion newVersion = this.cloneVersion(oldVersion);
            Map<String,Question> cloneMapped= this.clonedMap(newVersion);

            for (QuestionRequest req : requests){

                Question clonedQ = cloneMapped.get(req.getQuestionKey());

                if (clonedQ == null) continue;;

                this.applyUpdate(clonedQ,req);
            }
            surveyVersionRepo.save(newVersion);

        }else{

            //  loop all question that same version survey
            for (Question q: oldVersion.getQuestions()){

                // filter only changed question
                QuestionRequest req = requests.stream()
                        .filter(r -> r.getQuestionKey().equals(q.getQuestion_key()))
                        .findFirst()
                        .orElse(null);

                // pass only changed question to update process
                if (req != null) {
                    this.applyUpdate(q, req);
                }
            }
            questionRepo.saveAll(oldVersion.getQuestions());
        }
    }

    @Override
    @Transactional
    public void delectQuestion( List<Long> questionIDs, boolean createNewVersion) {

        if (questionIDs == null || questionIDs.isEmpty()) return;

        List<Question> questions = questionRepo.findAllById(questionIDs);
        if (questions.isEmpty()) {
            throw new RuntimeException("Questions not found");
        }

        SurveyVersion version = questions.getFirst().getSurveyVersion();
        boolean sameVersion = questions.stream()
                .allMatch(q -> q.getSurveyVersion().getId().equals(version.getId()));

        if (!sameVersion) {
            throw new RuntimeException("All questions must belong to same version");
        }

        if(createNewVersion){

            //  creating new version with duplicate questions and options
            SurveyVersion newVersion = this.cloneVersion(version);
            Map<String,Question> cloneMapped= this.clonedMap(newVersion);
            for (Question q : questions) {
                Question changedQ = cloneMapped.get(q.getQuestion_key());
                if (changedQ != null) {
                    newVersion.getQuestions().remove(changedQ);
                }
            }

            surveyVersionRepo.save(newVersion);

        }else {

            //  if not creating new version, when delete form current version
            questionRepo.deleteAll(questions);
        }
    }

    public SurveyVersion cloneVersion(SurveyVersion oldVersion){

        //  new version model
        SurveyVersion newVersion = SurveyVersion.builder()
                .active(true)
                .versionName(this.generateNextVersion(oldVersion.getSurvey()))  // generating new version name
                .survey(oldVersion.getSurvey())
                .build();


        Set<Question> newQuestions = new HashSet<>();
        int order=0;

        //  making duplicate all questions to new version
        for(Question q: oldVersion.getQuestions()){
             Question newQ = Question.builder()
                     .type(q.getType())
                     .order(order++)
                     .question_text(q.getQuestion_text())
                     .question_key(q.getQuestion_key())
                     .required(q.isRequired())
                     .surveyVersion(newVersion)
                     .build();

            Set<QsOption> newOpts = new HashSet<>();

            // making duplicate all options to new version
            for(QsOption qsOption : q.getOption()){
                QsOption newOption = QsOption.builder()
                        .question(newQ)
                        .order(qsOption.getOrder())
                        .option_key(qsOption.getOption_key())
                        .option_text(qsOption.getOption_text())
                        .active(qsOption.isActive())
                        .build();

                // adding to new option list
                newOpts.add(newOption);
            }

            newQ.setOption(newOpts);
            newQuestions.add(newQ);
        }

        //  final linking to new version
        newVersion.setQuestions(newQuestions);
        return newVersion;
    }

    public String generateNextVersion(Survey survey) {

        long count = surveyVersionRepo.countBySurveyId(survey.getId());
        return "V" + (count + 1);
    }

    public Map<String,Question> clonedMap(SurveyVersion newVersion) {
        return  newVersion.getQuestions()
                .stream()
                .collect(Collectors.toMap(Question::getQuestion_key, q -> q));
    }

    private void applyUpdate(Question oldquestion, QuestionRequest req) {

        oldquestion.setQuestion_text(req.getQuestionText());
        oldquestion.setType(req.getType());
        oldquestion.setRequired(req.isRequired());

        this.updateOption(oldquestion, req.getOptions());

    }

    private void updateOption(Question oldQuestion, List<OptionRequest> optionRequests){

        Map<String, QsOption> existingMap = oldQuestion.getOption()
                .stream()
                .collect(Collectors.toMap(
                        QsOption::getOption_key,
                        option -> option
                ));

        Set<QsOption> updatedOptions = new HashSet<>();

        for (OptionRequest req : optionRequests) {

            QsOption opt = existingMap.get(req.getKey());

            if(opt != null){
                opt.setOption_text(req.getLabel());
                opt.setOption_key(req.getKey());
                updatedOptions.add(opt);

            } else {

                QsOption newOpt = QsOption.builder()
                        .option_key(req.getKey())
                        .option_text(req.getLabel())
                        .question(oldQuestion)
                        .build();
                updatedOptions.add(newOpt);
            }
        }
        oldQuestion.getOption().clear();
        oldQuestion.getOption().addAll(updatedOptions);
    }

}
