package com.ncsu.farmtrackbackend.service;

import com.ncsu.farmtrackbackend.model.Farm;
import com.ncsu.farmtrackbackend.model.Movement;
import com.ncsu.farmtrackbackend.repository.FarmRepository;
import com.ncsu.farmtrackbackend.repository.MovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmService {
    @Autowired
    private FarmRepository farmRepository;
    @Autowired
    private MovementRepository movementRepository;

    public List<Farm> getAllFarms() {
        return farmRepository.findAll();
    }

    public Optional<Farm> getFarmById(String premiseId) {
        return farmRepository.findById(premiseId);
    }

    public Farm createFarm(Farm farm) {
        System.out.println("Farm: " + farm + " Premise ID: " + farmRepository.findById(farm.getPremiseId()));
        if (!farmRepository.findById(farm.getPremiseId()).isEmpty()) {
            throw new RuntimeException("Farm with premise ID " + farm.getPremiseId() + " already exists");
        }
        return farmRepository.save(farm);
    }

    public Farm updateFarm(String premiseId, Farm farmDetails) {
        Farm farm = farmRepository.findById(premiseId).orElseThrow(() -> new RuntimeException("Farm not found"));
        farm.setTotalAnimal(farmDetails.getTotalAnimal());
        return farmRepository.save(farm);
    }

    public void deleteFarm(String premiseId) {
        farmRepository.deleteById(premiseId);
    }

    public boolean hasAssociatedMovements(String premiseId) {
        List<Movement> movements = movementRepository.findByOriginFarm_PremiseIdOrDestinationFarm_PremiseId(premiseId, premiseId);
        return !movements.isEmpty();
    }
}