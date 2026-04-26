package com.example.qudev.service.imp;

import com.example.qudev.model.question.UserSurveySession;
import com.example.qudev.repository.SessionRepo;
import com.example.qudev.service.UserSessionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceIMP implements UserSessionService {

    final SessionRepo sessionRepo;

    public UserServiceIMP(SessionRepo sessionRepo) {
        this.sessionRepo = sessionRepo;
    }

    @Override
    public List<UserSurveySession> listUserSession() {
        return sessionRepo.findAll();
    }

}
