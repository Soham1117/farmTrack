package com.ncsu.farmtrackbackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "farm")
public class Farm {
    @Id
    @Column(name = "premiseid", unique = true, nullable = false)
    private String premiseId;

    @Column(name = "total_animal")
    private int totalAnimal;
}