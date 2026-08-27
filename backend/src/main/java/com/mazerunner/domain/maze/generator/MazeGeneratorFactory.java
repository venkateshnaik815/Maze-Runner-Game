package com.mazerunner.domain.maze.generator;

import com.mazerunner.domain.maze.MazeAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Component
public class MazeGeneratorFactory {

    private final Map<MazeAlgorithm, MazeGenerationStrategy> strategies = new EnumMap<>(MazeAlgorithm.class);

    @Autowired
    public MazeGeneratorFactory(List<MazeGenerationStrategy> strategyList) {
        for (MazeGenerationStrategy strategy : strategyList) {
            strategies.put(strategy.getAlgorithm(), strategy);
        }
    }

    public MazeGenerationStrategy getStrategy(MazeAlgorithm algorithm) {
        MazeGenerationStrategy strategy = strategies.get(algorithm);
        if (strategy == null) {
            throw new IllegalArgumentException("Algorithm not supported: " + algorithm);
        }
        return strategy;
    }
}
