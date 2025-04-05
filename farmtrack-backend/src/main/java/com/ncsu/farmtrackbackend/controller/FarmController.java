package com.ncsu.farmtrackbackend.controller;

import com.ncsu.farmtrackbackend.model.Farm;
import com.ncsu.farmtrackbackend.service.FarmService;
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
import org.springframework.http.HttpStatus;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/farms")
@Tag(name = "Farm", description = "Farm management API")
public class FarmController {
    @Autowired
    private FarmService farmService;

    @Operation(summary = "Get all farms", description = "Retrieve a list of all farms")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of farms",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = Farm.class)))
    @GetMapping
    public List<Farm> getAllFarms() {
        return farmService.getAllFarms();
    }

    @Operation(summary = "Get a farm by its ID", description = "Retrieve a farm by its premise ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the farm",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Farm.class))),
            @ApiResponse(responseCode = "404", description = "Farm not found",
                    content = @Content)
    })
    @GetMapping("/{premiseId}")
    public ResponseEntity<Farm> getFarmById(@Parameter(description = "Premise ID of the farm") @PathVariable String premiseId) {
        return farmService.getFarmById(premiseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new farm", description = "Add a new farm to the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully created the farm",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = Farm.class))),
        @ApiResponse(responseCode = "409", description = "Farm with this premise ID already exists",
            content = @Content)
    })
    @PostMapping
    public ResponseEntity<?> createFarm(@RequestBody Farm farm) {
        try {
            Farm createdFarm = farmService.createFarm(farm);
            return ResponseEntity.ok(createdFarm);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", e.getMessage());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
    }

    @Operation(summary = "Update a farm", description = "Update an existing farm's information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated the farm",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Farm.class))),
            @ApiResponse(responseCode = "404", description = "Farm not found",
                    content = @Content)
    })
    @PutMapping("/{premiseId}")
    public ResponseEntity<Farm> updateFarm(@Parameter(description = "Premise ID of the farm to be updated") @PathVariable String premiseId,
                                           @RequestBody Farm farmDetails) {
        return ResponseEntity.ok(farmService.updateFarm(premiseId, farmDetails));
    }

    @Operation(summary = "Delete a farm", description = "Remove a farm from the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted the farm"),
            @ApiResponse(responseCode = "404", description = "Farm not found",
                    content = @Content)
    })
    @DeleteMapping("/{premiseId}")
    public ResponseEntity<Void> deleteFarm(@Parameter(description = "Premise ID of the farm to be deleted") @PathVariable String premiseId) {
        farmService.deleteFarm(premiseId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Check if a farm has movements", description = "Determine if a farm has associated movements")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully checked for movements",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Boolean.class))),
            @ApiResponse(responseCode = "404", description = "Farm not found",
                    content = @Content)
    })
    @GetMapping("/{premiseId}/has-movements")
    public ResponseEntity<Boolean> hasMovements(@Parameter(description = "Premise ID of the farm to check for movements") @PathVariable String premiseId) {
        boolean hasMovements = farmService.hasAssociatedMovements(premiseId);
        return ResponseEntity.ok(hasMovements);
    }
}
