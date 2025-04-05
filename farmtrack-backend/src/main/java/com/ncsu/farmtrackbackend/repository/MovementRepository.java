package com.ncsu.farmtrackbackend.repository;

import com.ncsu.farmtrackbackend.model.Movement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {
    List<Movement> findByOriginFarm_PremiseIdOrDestinationFarm_PremiseId(String originPremiseId, String destinationPremiseId);
}