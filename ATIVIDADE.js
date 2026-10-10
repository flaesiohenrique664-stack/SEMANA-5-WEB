// Exemplo de array de pedidos de entrada
const pedidos = [
  { cliente: "Bia", valor: 120.00, status: "pago" },
  { cliente: "", valor: 50.00, status: "pago" }, // Inválido: cliente vazio
  { cliente: "Carlos", valor: -10.00, status: "pago" }, // Inválido: valor menor/igual a 0
  { cliente: "Ana", valor: 200.00, status: "pendente" }, // Inválido: status não é "pago"
  { cliente: "João", valor: 75.50, status: "pago" }
];

// 1. Validar cada pedido (cliente não vazio e valor numérico > 0)
const pedidosValidados = pedidos.filter(pedido => {
  return typeof pedido.cliente === 'string' && 
         pedido.cliente.trim() !== '' && 
         typeof pedido.valor === 'number' && 
         pedido.valor > 0;
});

// 2. Filtrar apenas os que possuem o status "pago"
const pedidosPagos = pedidosValidados.filter(pedido => pedido.status === "pago");

// 3. Calcular o total faturado utilizando reduce
const totalFaturado = pedidosPagos.reduce((acumulador, pedido) => acumulador + pedido.valor, 0);

// 4. Gerar textos no formato "Nome — R$ 0.00" utilizando toFixed(2)
const textosFormatados = pedidosPagos.map(pedido => {
  return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Pedidos Formatados:", textosFormatados);
console.log(`Total Faturado: R$ ${totalFaturado.toFixed(2)}`);