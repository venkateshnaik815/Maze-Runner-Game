package com.mazerunner.infrastructure.security;

import com.mazerunner.domain.user.User;
import com.mazerunner.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Security UserDetailsService implementation.
 *
 * <p>Loads user details by username (email or username lookup).
 * Converts domain User to Spring Security UserDetails with role-based
 * granted authorities.
 *
 * @author Venkatesh Naik
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads a Spring Security UserDetails object by username.
     *
     * <p>Looks up the user by username first; if not found tries by email.
     * Throws UsernameNotFoundException if no matching active user exists.
     *
     * @param username the username or email to look up
     * @return populated UserDetails
     * @throws UsernameNotFoundException if no active user found
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
        final User user = userRepository.findByUsernameOrEmail(username, username)
            .filter(User::isActive)
            .orElseThrow(() ->
                new UsernameNotFoundException("No active user found with identifier: " + username));

        return org.springframework.security.core.userdetails.User.builder()
            .username(user.getUsername())
            .password(user.getPasswordHash())
            .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())))
            .accountExpired(false)
            .accountLocked(!user.isActive())
            .credentialsExpired(false)
            .disabled(!user.isActive())
            .build();
    }
}
