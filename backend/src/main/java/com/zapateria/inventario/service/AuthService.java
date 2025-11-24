package com.zapateria.inventario.service;

import com.zapateria.inventario.dto.LoginRequest;
import com.zapateria.inventario.dto.LoginResponse;
import com.zapateria.inventario.model.Rol;
import com.zapateria.inventario.model.Usuario;
import com.zapateria.inventario.repository.UsuarioRepository;
import com.zapateria.inventario.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private AuthenticationManager authenticationManager;
    private UsuarioRepository usuarioRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public LoginResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

        return new LoginResponse(token, usuario.getRol().name(), usuario.getUsername());
    }

    public void initAdmin() {
        if (!usuarioRepository.existsByUsername("admin")) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombre("Administrador");
            admin.setRol(Rol.ADMIN);
            usuarioRepository.save(admin);
        }

        if (!usuarioRepository.existsByUsername("operador")) {
            Usuario op = new Usuario();
            op.setUsername("operador");
            op.setPassword(passwordEncoder.encode("operador123"));
            op.setNombre("Operador Caja");
            op.setRol(Rol.OPERADOR);
            usuarioRepository.save(op);
        }
    }
}
