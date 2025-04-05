package com.ncsu.farmtrackbackend.controller;


import com.ncsu.farmtrackbackend.security.JwtTokenUtil;
import com.ncsu.farmtrackbackend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private UserService userService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateAuthenticationToken() throws Exception {
        JwtRequest jwtRequest = new JwtRequest();
        jwtRequest.setUsername("testuser");
        jwtRequest.setPassword("password");

        UserDetails userDetails = new User("testuser", "password", new ArrayList<>());
        when(userService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(jwtTokenUtil.generateToken(any(UserDetails.class))).thenReturn("test-token");

        ResponseEntity<?> responseEntity = authController.createAuthenticationToken(jwtRequest);
        JwtResponse jwtResponse = (JwtResponse) responseEntity.getBody();

        assertEquals("test-token", jwtResponse.getToken());
    }
}
