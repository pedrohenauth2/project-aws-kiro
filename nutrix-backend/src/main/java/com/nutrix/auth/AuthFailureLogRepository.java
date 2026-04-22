package com.nutrix.auth;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthFailureLogRepository extends JpaRepository<AuthFailureLog, Long> {
}
