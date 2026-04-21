package com.example.qudev.repository;

import com.example.qudev.model.question.SurveyVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SurveyVersionRepo extends JpaRepository<SurveyVersion,Long> {

    @Override
    Optional<SurveyVersion> findById(Long id);
    @Query("""
    SELECT v FROM SurveyVersion v
    LEFT JOIN FETCH v.questions q
    LEFT JOIN FETCH q.option
    WHERE v.id = :versionId
""")
    Optional<SurveyVersion> fetchFullVersion(@Param("versionId") long versionId);
}
