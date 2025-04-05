package com.ncsu.farmtrackbackend.controller;

import com.ncsu.farmtrackbackend.model.User;
import com.ncsu.farmtrackbackend.security.JwtTokenUtil;
import com.ncsu.farmtrackbackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @Operation(summary = "Authenticate user", description = "Authenticate a user and return a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successful authentication", 
                     content = { @Content(mediaType = "application/json", 
                     schema = @Schema(implementation = JwtResponse.class)) }),
        @ApiResponse(responseCode = "401", description = "Invalid credentials", 
                     content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = userService.loadUserByUsername(authenticationRequest.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(new JwtResponse(token));
    }

    @Operation(summary = "Register new user", description = "Register a new user in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User successfully registered", 
                     content = { @Content(mediaType = "application/json", 
                     schema = @Schema(implementation = User.class)) }),
        @ApiResponse(responseCode = "400", description = "Invalid input", 
                     content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}

@Schema(description = "JWT Authentication Request")
class JwtRequest {
    @Schema(description = "User's username", example = "john_doe")
    private String username;
    
    @Schema(description = "User's password", example = "password123")
    private String password;
    
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

@Schema(description = "JWT Authentication Response")
class JwtResponse {
    @Schema(description = "JWT token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private final String token;
    
    public JwtResponse(String token) {
        this.token = token;
    }
    
    public String getToken() {
        return token;
    }
}
