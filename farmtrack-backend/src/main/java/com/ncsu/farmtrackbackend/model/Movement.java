package com.ncsu.farmtrackbackend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "movement")
public class Movement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "movement_id")
    private Long movementId;

    @ManyToOne
    @JoinColumn(name = "new_originpremid", referencedColumnName = "premiseid")
    private Farm originFarm;

    @ManyToOne
    @JoinColumn(name = "new_destinationpremid", referencedColumnName = "premiseid")
    private Farm destinationFarm;

    @Column(name = "new_numitemsmoved")
    private int numItemsMoved;
}