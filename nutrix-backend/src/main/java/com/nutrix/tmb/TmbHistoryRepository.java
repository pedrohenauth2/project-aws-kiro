package com.nutrix.tmb;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TmbHistoryRepository extends JpaRepository<TmbHistory, Long> {
    
    List<TmbHistory> findByUserIdOrderByCalculatedAtDesc(Long userId);

    void deleteByUserId(Long userId);
}
