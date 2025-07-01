// Script de debug para probar la función calculateTrend refactorizada
// Uso: node debug_scripts/test_trend_calculation.js

console.log("🧪 Testing calculateTrend function...\n");

// Simulación de la función calculateTrend
const AnalyticType = {
  TOTAL_USERS: "TOTAL_USERS",
  NEW_USERS: "NEW_USERS",
  USERS_WITHOUT_MESSAGES: "USERS_WITHOUT_MESSAGES",
};

const StatisticsDisplayType = {
  METRIC: "METRIC",
  METRIC_AVG: "METRIC_AVG",
  METRIC_ACUM: "METRIC_ACUM",
};

const calculateTrend = (entries, displayType, requestedTypes) => {
  if (entries.length === 0) return undefined;

  // Para múltiples tipos de analítica, no calcular tendencia global
  if (requestedTypes.length > 1) {
    console.log("  ⚠️  Múltiples tipos detectados, no se calcula tendencia");
    return undefined;
  }

  // Agrupar por tipo
  const entriesByType = entries.reduce((acc, entry) => {
    acc[entry.type] = acc[entry.type] || [];
    acc[entry.type].push(entry);
    return acc;
  }, {});

  const singleType = requestedTypes[0];
  const typeEntries = entriesByType[singleType];

  if (!typeEntries || typeEntries.length < 2) {
    console.log("  ⚠️  Insuficientes datos para calcular tendencia");
    return undefined;
  }

  // Ordenar por fecha
  const sorted = [...typeEntries].sort(
    (a, b) => a.created_at.getTime() - b.created_at.getTime()
  );

  // Preparar datos según el tipo de display
  let points;
  const startTime = sorted[0].created_at.getTime();

  if (displayType === StatisticsDisplayType.METRIC_AVG) {
    console.log("  📊 Calculando tendencia para METRIC_AVG (promedio diario)");

    // Para promedio, agrupar por día y calcular promedio diario
    const dailyGroups = sorted.reduce((acc, entry) => {
      const dayKey = entry.created_at.toISOString().split("T")[0];
      acc[dayKey] = acc[dayKey] || [];
      acc[dayKey].push(entry);
      return acc;
    }, {});

    points = Object.entries(dailyGroups).map(([dateStr, dayEntries]) => {
      const date = new Date(dateStr);
      const daysSinceStart =
        (date.getTime() - startTime) / (1000 * 60 * 60 * 24);
      const avgValue =
        dayEntries.reduce((sum, entry) => sum + entry.value, 0) /
        dayEntries.length;
      return { x: daysSinceStart, y: avgValue };
    });
  } else {
    console.log(
      "  📊 Calculando tendencia para METRIC/METRIC_ACUM (valores directos)"
    );

    // Para suma/acumulado, usar valores directos
    points = sorted.map(entry => ({
      x: (entry.created_at.getTime() - startTime) / (1000 * 60 * 60 * 24),
      y: entry.value,
    }));
  }

  if (points.length < 2) return undefined;

  console.log(
    "  📈 Puntos para comparación:",
    points.map(p => `(${p.x.toFixed(1)}, ${p.y})`).join(", ")
  );

  // Calcular porcentaje de cambio entre primer y último punto
  const firstValue = points[0].y;
  const lastValue = points[points.length - 1].y;

  console.log("  📊 Primer valor:", firstValue, "Último valor:", lastValue);

  if (firstValue === 0) {
    console.log("  ⚠️  Primer valor es 0, usando crecimiento absoluto");
    return {
      value: Math.round(Math.abs(lastValue)),
      isPositive: lastValue >= 0,
    };
  }

  const percentageChange =
    ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
  console.log("  📈 Cambio porcentual:", percentageChange.toFixed(2) + "%");

  return {
    value: Math.round(Math.abs(percentageChange)),
    isPositive: percentageChange >= 0,
  };
};

// Casos de prueba
console.log("=".repeat(60));
console.log("TEST 1: Tendencia creciente - METRIC");
console.log("=".repeat(60));

const testData1 = [
  { type: "TOTAL_USERS", created_at: new Date("2024-01-01"), value: 10 },
  { type: "TOTAL_USERS", created_at: new Date("2024-01-02"), value: 15 },
  { type: "TOTAL_USERS", created_at: new Date("2024-01-03"), value: 20 },
  { type: "TOTAL_USERS", created_at: new Date("2024-01-04"), value: 25 },
];

const trend1 = calculateTrend(testData1, StatisticsDisplayType.METRIC, [
  "TOTAL_USERS",
]);
console.log("Resultado:", trend1);
console.log("Esperado: 150% (de 10 a 25)\n");

console.log("=".repeat(60));
console.log("TEST 2: Tendencia decreciente - METRIC_AVG");
console.log("=".repeat(60));

const testData2 = [
  { type: "NEW_USERS", created_at: new Date("2024-01-01T08:00:00"), value: 20 },
  { type: "NEW_USERS", created_at: new Date("2024-01-01T16:00:00"), value: 10 },
  { type: "NEW_USERS", created_at: new Date("2024-01-02T08:00:00"), value: 15 },
  { type: "NEW_USERS", created_at: new Date("2024-01-02T16:00:00"), value: 5 },
  { type: "NEW_USERS", created_at: new Date("2024-01-03T08:00:00"), value: 8 },
  { type: "NEW_USERS", created_at: new Date("2024-01-03T16:00:00"), value: 2 },
];

const trend2 = calculateTrend(testData2, StatisticsDisplayType.METRIC_AVG, [
  "NEW_USERS",
]);
console.log("Resultado:", trend2);
console.log("Esperado: 67% negativo (de promedio 15 a promedio 5)\n");

console.log("=".repeat(60));
console.log("TEST 3: Múltiples tipos - No debe calcular tendencia");
console.log("=".repeat(60));

const testData3 = [
  { type: "TOTAL_USERS", created_at: new Date("2024-01-01"), value: 10 },
  { type: "NEW_USERS", created_at: new Date("2024-01-01"), value: 5 },
];

const trend3 = calculateTrend(testData3, StatisticsDisplayType.METRIC, [
  "TOTAL_USERS",
  "NEW_USERS",
]);
console.log("Resultado:", trend3);
console.log("Esperado: undefined\n");

console.log("=".repeat(60));
console.log("TEST 4: Datos insuficientes");
console.log("=".repeat(60));

const testData4 = [
  { type: "TOTAL_USERS", created_at: new Date("2024-01-01"), value: 10 },
];

const trend4 = calculateTrend(testData4, StatisticsDisplayType.METRIC, [
  "TOTAL_USERS",
]);
console.log("Resultado:", trend4);
console.log("Esperado: undefined\n");

console.log("=".repeat(60));
console.log("TEST 5: Empezando desde 0");
console.log("=".repeat(60));

const testData5 = [
  {
    type: "USERS_WITHOUT_MESSAGES",
    created_at: new Date("2024-01-01"),
    value: 0,
  },
  {
    type: "USERS_WITHOUT_MESSAGES",
    created_at: new Date("2024-01-02"),
    value: 5,
  },
  {
    type: "USERS_WITHOUT_MESSAGES",
    created_at: new Date("2024-01-03"),
    value: 10,
  },
];

const trend5 = calculateTrend(testData5, StatisticsDisplayType.METRIC, [
  "USERS_WITHOUT_MESSAGES",
]);
console.log("Resultado:", trend5);
console.log("Esperado: 10 (crecimiento absoluto)\n");

console.log("✅ Pruebas completadas");
