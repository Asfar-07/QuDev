package com.example.qudev.service.imp;

import com.example.qudev.model.question.SurveyVersion;
import com.example.qudev.model.question.UserSurveySession;
import com.example.qudev.repository.SessionRepo;
import com.example.qudev.service.UserSessionService;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class UserServiceIMP implements UserSessionService {

    final SessionRepo sessionRepo;

    public UserServiceIMP(SessionRepo sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    @Override
    public List<UserSurveySession> listUserSession() {
        return sessionRepo.findAll();
    }

    @Override
    public UserSurveySession addUserSession(long userId, SurveyVersion version) {

        UserSurveySession session = sessionRepo.findByUserIdAndSurveyVersionId(userId,version.getId()).orElse(null);

        if(session != null && session.getStatus().equals("Completed")){
            return  null;
        }
        if(session != null && session.getStatus().equals("progress")){
            session.setStartedAt(LocalDateTime.now());
            return  sessionRepo.save(session);
        }
        UserSurveySession newSession = UserSurveySession.builder()
                .userId(userId)
                .status("progress")
                .startedAt(LocalDateTime.now())
                .surveyVersion(version)
                .build();

        return sessionRepo.save(newSession);
    }

    @Override
    public void updateSession(long sessionId) {

    }

}
