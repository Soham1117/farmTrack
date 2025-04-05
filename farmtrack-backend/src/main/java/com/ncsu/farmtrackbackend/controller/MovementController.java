package com.ncsu.farmtrackbackend.controller;

import com.ncsu.farmtrackbackend.model.Movement;
import com.ncsu.farmtrackbackend.service.MovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movements")
@Tag(name = "Movement", description = "Movement management API")
public class MovementController {
    @Autowired
    private MovementService movementService;

    @Operation(summary = "Get all movements", description = "Retrieve a list of all movements")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of movements",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Movement.class)))
    @GetMapping
    public List<Movement> getAllMovements() {
        return movementService.getAllMovements();
    }

    @Operation(summary = "Get a movement by its ID", description = "Retrieve a movement by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the movement",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Movement.class))),
            @ApiResponse(responseCode = "404", description = "Movement not found",
                    content = @Content)
    })
    @GetMapping("/{movementId}")
    public ResponseEntity<Movement> getMovementById(@Parameter(description = "ID of the movement") @PathVariable Long movementId) {
        return movementService.getMovementById(movementId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new movement", description = "Add a new movement to the system")
    @ApiResponse(responseCode = "200", description = "Successfully created the movement",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Movement.class)))
    @PostMapping
    public Movement createMovement(@RequestBody Movement movement) {
        return movementService.createMovement(movement);
    }

    @Operation(summary = "Update a movement", description = "Update an existing movement's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated the movement",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Movement.class))),
            @ApiResponse(responseCode = "404", description = "Movement not found",
                    content = @Content)
    })
    @PutMapping("/{movementId}")
    public ResponseEntity<Movement> updateMovement(@Parameter(description = "ID of the movement to be updated") @PathVariable Long movementId,
                                                   @RequestBody Movement movementDetails) {
        return ResponseEntity.ok(movementService.updateMovement(movementId, movementDetails));
    }

    @Operation(summary = "Delete a movement", description = "Remove a movement from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted the movement"),
            @ApiResponse(responseCode = "404", description = "Movement not found",
                    content = @Content)
    })
    @DeleteMapping("/{movementId}")
    public ResponseEntity<Void> deleteMovement(@Parameter(description = "ID of the movement to be deleted") @PathVariable Long movementId) {
        movementService.deleteMovement(movementId);
        return ResponseEntity.noContent().build();
    }
}
