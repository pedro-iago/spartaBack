package com.spartaApp.api.modules.anamnese.service;

import com.spartaApp.api.modules.anamnese.domain.Anamnesis;
import com.spartaApp.api.modules.anamnese.dto.AnamnesisResponseDTO;
import com.spartaApp.api.modules.anamnese.dto.CreateAnamnesisDTO;
import com.spartaApp.api.modules.anamnese.repository.AnamnesisRepository;
import com.spartaApp.api.modules.auth.domain.User;
import com.spartaApp.api.modules.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AnamnesisService {

    @Autowired
    private AnamnesisRepository anamnesisRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AnamnesisResponseDTO createAnamnesis(UUID userId, CreateAnamnesisDTO data) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 1. Desativa anamnese anterior se existir
        anamnesisRepository.findByUserIdAndActiveTrue(userId)
                .ifPresent(old -> {
                    old.setActive(false);
                    anamnesisRepository.save(old);
                });

        // 2. Cria nova
        Anamnesis anamnesis = new Anamnesis();
        anamnesis.setUser(user);
        anamnesis.setWeight(data.weight());
        anamnesis.setHeight(data.height());
        anamnesis.setAge(data.age());
        anamnesis.setGender(data.gender());
        anamnesis.setGoal(data.goal());
        anamnesis.setActivityLevel(data.activityLevel());
        anamnesis.setDaysPerWeekAvailable(data.daysPerWeekAvailable());
        anamnesis.setInjuries(data.injuries());
        anamnesis.setMedicalConditions(data.medicalConditions());
        anamnesis.setActive(true);

        Anamnesis saved = anamnesisRepository.save(anamnesis);
        return AnamnesisResponseDTO.fromEntity(saved);
    }

    public AnamnesisResponseDTO getActiveAnamnesis(UUID userId) {
        return anamnesisRepository.findByUserIdAndActiveTrue(userId)
                .map(AnamnesisResponseDTO::fromEntity)
                .orElse(null); // Retorna null (204 No Content) se não tiver
    }
}