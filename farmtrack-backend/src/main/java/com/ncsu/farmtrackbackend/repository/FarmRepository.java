package com.ncsu.farmtrackbackend.repository;

import com.ncsu.farmtrackbackend.model.Farm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FarmRepository extends JpaRepository<Farm, String> {
}