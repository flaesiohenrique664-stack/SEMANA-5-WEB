### Pergunta: Por que Promise.all pode ser mais rápido que vários await seguidos?

**Resposta:**
O uso de múltiplos `await` de forma sequencial faz com que o JavaScript espere a conclusão de uma requisição ou operação assíncrona antes de iniciar a próxima (comportamento síncrono em termos de fluxo de espera). Se fizermos três requisições que levam 1 segundo cada uma em sequência, o tempo total será de aproximadamente 3 segundos.

Em contrapartida, o `Promise.all()` dispara todas as promessas/requisições **em paralelo** e aguarda todas terminarem juntas. Como as requisições de rede ocorrem simultaneamente, o tempo total de espera será ditado apenas pela requisição mais lenta entre elas (aproximadamente 1 segundo no exemplo acima), otimizando drasticamente o desempenho da aplicação web.