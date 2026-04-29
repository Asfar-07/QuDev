package com.example.qudev.service;

import com.example.qudev.model.question.SurveyVersion;
import com.example.qudev.model.question.UserSurveySession;

import java.util.List;

public interface UserSessionService {

    List<UserSurveySession> listUserSession();
    UserSurveySession addUserSession(long userId, SurveyVersion version);
    void updateSession(long sessionId);
}
