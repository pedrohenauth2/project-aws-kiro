# NUTRIX - MODERNIZATION - DESAFIO 2

## Resumo

Este documento descreve as melhorias técnicas aplicadas ao projeto NUTRIX, comparando o cenário anterior com o cenário modernizado. Todas as mudanças são retrocompatíveis — não alteram o deploy, banco de dados ou comportamento funcional.

---

## Melhorias Implementadas

### 1. Java Records nos DTOs

**Antes:** DTOs usavam classes com Lombok (`@Data`, `@NoArgsConstructor`, `@AllArgsConstructor`) — geravam getters, setters, equals, hashCode e toString via anotações.

**Depois:** DTOs imutáveis convertidos para Java Records — sintaxe nativa do Java 17, sem dependência de Lombok para esses casos.

| DTO | Antes | Depois |
|-----|-------|--------|
| `TmbResponseDto` | Classe Lombok (15 linhas) | Record (6 linhas) |
| `LoginResponseDto` | Classe Lombok (14 linhas) | Record (8 linhas) |
| `ExerciseDto` | Classe Lombok (14 linhas) | Record (9 linhas) |
| `ExerciseVariationDto` | Classe Lombok (10 linhas) | Record (5 linhas) |
| `MuscleGroupWithExercisesDto` | Classe Lombok (12 linhas) | Record (8 linhas) |
| `ErrorResponse` (inner class) | Classe Lombok (8 linhas) | Record (7 linhas) |

**Benefícios:**
- Imutabilidade garantida pelo compilador
- Menos código boilerplate
- Semântica clara de "transportador de dados"
- Não requer processamento de anotações em tempo de compilação

**Nota:** DTOs com validação Bean Validation (`TmbRequestDto`, `LoginRequestDto`, `WorkoutPlanDto`, etc.) foram mantidos como classes Lombok, pois records não suportam `@NotNull` em campos de forma idiomática com frameworks de validação.

---

### 2. Spring Boot Actuator (Health Check)

**Antes:** Nenhum endpoint de monitoramento. Impossível verificar se o backend está saudável sem fazer uma requisição autenticada.

**Depois:** Endpoint `/actuator/health` disponível publicamente.

```
GET https://nutrix-backend-fibs.onrender.com/actuator/health
Response: { "status": "UP" }
```

**Benefícios:**
- Monitoramento de saúde do serviço
- Compatível com health checks do Render
- Endpoint `/actuator/info` também disponível

---

### 3. SpringDoc OpenAPI (Swagger UI)

**Antes:** Documentação da API apenas em arquivos markdown. Para testar endpoints, era necessário usar curl ou Postman manualmente.

**Depois:** Documentação interativa automática via Swagger UI.

```
Swagger UI: https://nutrix-backend-fibs.onrender.com/swagger-ui.html
OpenAPI JSON: https://nutrix-backend-fibs.onrender.com/api-docs
```

**Benefícios:**
- Documentação gerada automaticamente a partir do código
- Interface interativa para testar endpoints
- Suporte a autenticação JWT integrado (botão "Authorize")
- Sempre sincronizada com o código real

---

### 4. Interceptor Global de Erros 401 (Frontend)

**Antes:** Se o token JWT expirasse durante o uso, cada componente tratava o erro individualmente. Em alguns casos, o usuário via "Erro interno" sem ser redirecionado para o login.

**Depois:** Interceptor `errorInterceptor` centralizado que captura qualquer resposta 401 (exceto no login), limpa a sessão e redireciona para `/login` com mensagem "Sessão expirada".

**Benefícios:**
- Tratamento centralizado de expiração de token
- Experiência consistente para o usuário
- Menos código duplicado nos componentes

---

## O que NÃO mudou

| Item | Status |
|------|--------|
| Deploy (Render/Vercel) | Sem alteração |
| Dockerfile | Sem alteração |
| Variáveis de ambiente | Sem alteração |
| Banco de dados (Supabase) | Sem alteração |
| Rotas da API | Sem alteração |
| Comportamento funcional | Sem alteração |
| Versão do Java (17) | Sem alteração |
| Versão do Spring Boot (3.2.5) | Sem alteração |
| Versão do Angular (17) | Sem alteração |

---

## Comparativo de Código

### Exemplo: TmbResponseDto

**Antes (Lombok):**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TmbResponseDto {
    private BigDecimal tmbKcal;
    private BigDecimal tdeeKcal;
}
```

**Depois (Record):**
```java
public record TmbResponseDto(
    BigDecimal tmbKcal,
    BigDecimal tdeeKcal
) {}
```

### Exemplo: Error Interceptor (Frontend)

**Antes:** Nenhum tratamento centralizado.

**Depois:**
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        authService.logout();
        toastService.showError('Sessão expirada. Faça login novamente.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
```

---

## Ferramentas Utilizadas

- **Kiro** — Análise de código, identificação de melhorias e implementação assistida
- **Java Records** — Feature nativa do Java 14+ (usada com Java 17)
- **SpringDoc OpenAPI 2.5.0** — Geração automática de documentação
- **Spring Boot Actuator** — Monitoramento e health checks
