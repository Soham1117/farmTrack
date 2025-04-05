package com.ncsu.farmtrackbackend.controller;

import com.ncsu.farmtrackbackend.model.User;
import com.ncsu.farmtrackbackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;


@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "User management API")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "Get all users", description = "Retrieve a list of all users. Requires ADMIN or VIEWER role.")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = User.class)))
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('VIEWER')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @Operation(summary = "Get a user by ID", description = "Retrieve a user by their ID. Requires ADMIN or VIEWER role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the user",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = User.class))),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content)
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('VIEWER')")
    public ResponseEntity<User> getUserById(@Parameter(description = "ID of the user") @PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create a new user", description = "Add a new user to the system. Requires ADMIN role.")
    @ApiResponse(responseCode = "200", description = "Successfully created the user",
            content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = User.class)))
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try{
                User createdUser = userService.createUser(user);
                return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", e.getMessage());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
    }

    @Operation(summary = "Delete a user by ID", description = "Delete a user by their ID. Requires ADMIN role.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Successfully deleted the user"),
            @ApiResponse(responseCode = "404", description = "User not found",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = User.class)))})
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@Parameter(description = "ID of the user") @PathVariable Long id) {
        if (id == 1 || id == 2 || id == 3) 
        {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete protected user with ID " + id);
        }
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
