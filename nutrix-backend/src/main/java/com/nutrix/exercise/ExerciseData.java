package com.nutrix.exercise;

import com.nutrix.exercise.dto.ExerciseDto;
import com.nutrix.exercise.dto.ExerciseVariationDto;
import com.nutrix.exercise.dto.MuscleGroupWithExercisesDto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Dados estáticos de exercícios, grupos musculares e variações.
 * Estes dados são gerenciados no código e não no banco de dados.
 */
public class ExerciseData {

    private static long exerciseIdCounter = 1;
    private static long variationIdCounter = 1;

    public static List<MuscleGroupWithExercisesDto> getAllExercises() {
        List<MuscleGroupWithExercisesDto> muscleGroups = new ArrayList<>();

        muscleGroups.add(createPeito());
        muscleGroups.add(createCostas());
        muscleGroups.add(createBiceps());
        muscleGroups.add(createTriceps());
        muscleGroups.add(createOmbros());
        muscleGroups.add(createPernas());
        muscleGroups.add(createGluteos());
        muscleGroups.add(createAbdomen());
        muscleGroups.add(createCardio());

        return muscleGroups;
    }

    private static MuscleGroupWithExercisesDto createPeito() {
        return new MuscleGroupWithExercisesDto(
                1L,
                "Peito",
                Arrays.asList(
                        createExercise("Supino Reto", "Exercício composto para peitoral", 
                                "Com barra", "Com halteres", "Na máquina"),
                        createExercise("Supino Inclinado", "Foco no peitoral superior", 
                                "Com barra", "Com halteres"),
                        createExercise("Supino Declinado", "Foco no peitoral inferior", 
                                "Com barra", "Com halteres"),
                        createExercise("Crucifixo", "Exercício de isolamento", 
                                "Com halteres", "Na máquina"),
                        createExercise("Peck Deck", "Isolamento na máquina"),
                        createExercise("Crossover", "Exercício no cabo", 
                                "Cabo alto", "Cabo baixo"),
                        createExercise("Flexão de Braço", "Exercício com peso corporal", 
                                "Tradicional", "Diamante", "Inclinada")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createCostas() {
        return new MuscleGroupWithExercisesDto(
                2L,
                "Costas",
                Arrays.asList(
                        createExercise("Puxada Frontal", "Exercício para dorsais", 
                                "Pegada aberta", "Pegada fechada", "Pegada neutra"),
                        createExercise("Remada Curvada", "Exercício composto", 
                                "Com barra", "Com halteres"),
                        createExercise("Remada Unilateral", "Isolamento unilateral", 
                                "Com haltere", "No cabo"),
                        createExercise("Remada Cavalinho", "Exercício na máquina"),
                        createExercise("Pulldown", "Variação de puxada"),
                        createExercise("Levantamento Terra", "Exercício composto completo"),
                        createExercise("Barra Fixa", "Exercício com peso corporal", 
                                "Pegada supinada", "Pegada pronada")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createBiceps() {
        return new MuscleGroupWithExercisesDto(
                3L,
                "Bíceps",
                Arrays.asList(
                        createExercise("Rosca Direta", "Exercício básico de bíceps", 
                                "Com barra", "Com halteres", "Com barra W"),
                        createExercise("Rosca Alternada", "Exercício unilateral", 
                                "Com halteres"),
                        createExercise("Rosca Martelo", "Foco no braquial", 
                                "Com halteres", "No cabo"),
                        createExercise("Rosca Concentrada", "Isolamento intenso"),
                        createExercise("Rosca Scott", "Exercício no banco scott", 
                                "Com barra", "Com haltere"),
                        createExercise("Rosca no Cabo", "Tensão constante")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createTriceps() {
        return new MuscleGroupWithExercisesDto(
                4L,
                "Tríceps",
                Arrays.asList(
                        createExercise("Tríceps Pulley", "Exercício no cabo", 
                                "Corda", "Barra reta", "Barra V"),
                        createExercise("Tríceps Testa", "Exercício deitado", 
                                "Com barra", "Com halteres"),
                        createExercise("Tríceps Francês", "Exercício overhead", 
                                "Com barra", "Com haltere"),
                        createExercise("Mergulho", "Exercício composto", 
                                "No banco", "Nas paralelas"),
                        createExercise("Kickback", "Isolamento"),
                        createExercise("Supino Fechado", "Exercício composto")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createOmbros() {
        return new MuscleGroupWithExercisesDto(
                5L,
                "Ombros",
                Arrays.asList(
                        createExercise("Desenvolvimento", "Exercício composto", 
                                "Com barra", "Com halteres", "Na máquina"),
                        createExercise("Elevação Lateral", "Isolamento do deltoide lateral", 
                                "Com halteres", "No cabo"),
                        createExercise("Elevação Frontal", "Foco no deltoide anterior", 
                                "Com halteres", "Com barra"),
                        createExercise("Remada Alta", "Exercício composto"),
                        createExercise("Encolhimento", "Trapézio", 
                                "Com barra", "Com halteres")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createPernas() {
        return new MuscleGroupWithExercisesDto(
                6L,
                "Pernas",
                Arrays.asList(
                        createExercise("Agachamento", "Exercício composto principal", 
                                "Livre com barra", "Hack squat", "Sumô"),
                        createExercise("Leg Press", "Exercício na máquina", 
                                "45 graus", "Horizontal"),
                        createExercise("Extensão de Pernas", "Isolamento do quadríceps"),
                        createExercise("Flexão de Pernas", "Isolamento dos posteriores"),
                        createExercise("Stiff", "Posteriores e glúteos", 
                                "Com barra", "Com halteres"),
                        createExercise("Avanço", "Exercício unilateral", 
                                "Com halteres", "Com barra"),
                        createExercise("Panturrilha", "Isolamento da panturrilha", 
                                "Em pé", "Sentado")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createGluteos() {
        return new MuscleGroupWithExercisesDto(
                7L,
                "Glúteos",
                Arrays.asList(
                        createExercise("Hip Thrust", "Exercício principal para glúteos", 
                                "Com barra", "Com haltere"),
                        createExercise("Glúteo no Cabo", "Isolamento", 
                                "Extensão posterior"),
                        createExercise("Abdução de Quadril", "Glúteo médio", 
                                "Na máquina", "Com elástico"),
                        createExercise("Agachamento Sumô", "Foco em glúteos e adutores")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createAbdomen() {
        return new MuscleGroupWithExercisesDto(
                8L,
                "Abdômen",
                Arrays.asList(
                        createExercise("Abdominal Crunch", "Exercício básico", 
                                "No solo", "Na máquina"),
                        createExercise("Prancha", "Exercício isométrico", 
                                "Frontal", "Lateral"),
                        createExercise("Abdominal Infra", "Foco no abdômen inferior", 
                                "Elevação de pernas"),
                        createExercise("Oblíquo", "Músculos laterais", 
                                "Rotação com cabo", "Crunch lateral"),
                        createExercise("Abdominal na Polia", "Tensão constante")
                )
        );
    }

    private static MuscleGroupWithExercisesDto createCardio() {
        return new MuscleGroupWithExercisesDto(
                9L,
                "Cardio",
                Arrays.asList(
                        createExercise("Esteira", "Corrida ou caminhada", 
                                "Caminhada", "Corrida", "Inclinada"),
                        createExercise("Bicicleta", "Exercício de baixo impacto", 
                                "Ergométrica", "Spinning"),
                        createExercise("Elíptico", "Baixo impacto"),
                        createExercise("Corda", "Alta intensidade"),
                        createExercise("Remo Ergométrico", "Corpo inteiro"),
                        createExercise("HIIT", "Treino intervalado", 
                                "Tabata", "Circuito")
                )
        );
    }

    private static ExerciseDto createExercise(String name, String description, String... variations) {
        long exerciseId = exerciseIdCounter++;
        List<ExerciseVariationDto> variationList = new ArrayList<>();
        
        for (String variationName : variations) {
            variationList.add(new ExerciseVariationDto(variationIdCounter++, variationName));
        }
        
        return new ExerciseDto(exerciseId, name, description, variationList);
    }
}
