package com.example.qudev.repository;

import com.example.qudev.model.question.SurveyVersion;
import com.example.qudev.model.question.UserSurveySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepo extends JpaRepository<UserSurveySession,Long> {

    Optional<UserSurveySession> findByUserIdAndSurveyVersionId(Long userId, Long surveyVersionId);
}
