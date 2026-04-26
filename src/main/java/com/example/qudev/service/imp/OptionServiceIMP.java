package com.example.qudev.service.imp;

import com.example.qudev.model.question.QsOption;
import com.example.qudev.repository.QsOptionRepo;
import com.example.qudev.service.OptionService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OptionServiceIMP implements OptionService {

    final QsOptionRepo qsOptionRepo;

    public OptionServiceIMP(QsOptionRepo qsOptionRepo) {
        this.qsOptionRepo = qsOptionRepo;
    }

    @Override
    public List<QsOption> listOption() {
        return qsOptionRepo.findAll();
    }
}
