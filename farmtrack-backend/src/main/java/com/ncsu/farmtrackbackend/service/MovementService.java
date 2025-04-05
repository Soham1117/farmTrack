package com.ncsu.farmtrackbackend.service;

import com.ncsu.farmtrackbackend.model.Movement;
import com.ncsu.farmtrackbackend.repository.MovementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovementService {
    @Autowired
    private MovementRepository movementRepository;

    public List<Movement> getAllMovements() {
        return movementRepository.findAll();
    }

    public Optional<Movement> getMovementById(Long movementId) {
        return movementRepository.findById(movementId);
    }

    public Movement createMovement(Movement movement) {
        movement.setMovementId(null); 
        return movementRepository.save(movement);
    }

    public Movement updateMovement(Long movementId, Movement movementDetails) {
        Movement movement = movementRepository.findById(movementId).orElseThrow(() -> new RuntimeException("Movement not found"));
        movement.setOriginFarm(movementDetails.getOriginFarm());
        movement.setDestinationFarm(movementDetails.getDestinationFarm());
        movement.setNumItemsMoved(movementDetails.getNumItemsMoved());
        return movementRepository.save(movement);
    }

    public void deleteMovement(Long movementId) {
        movementRepository.deleteById(movementId);
    }
}