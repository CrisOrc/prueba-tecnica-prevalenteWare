// jest.config.js
import nextJest from "next/jest";

/**
 * Mediante 'nextJest', heredamos parte de la config de Next.js
 * para compilar nuestra app en Jest sin problemas.
 */
const createJestConfig = nextJest({
  dir: "./", // Indica la ruta de tu proyecto Next.js
});

/**
 * Configuración personalizada de Jest.
 */
const customJestConfig = {
  testEnvironment: "node",
  // Si vas a colocar tests en carpetas específicas, añade sus rutas:
  // testMatch: ["**/__tests__/**/*.[jt]s?(x)"],
  // ModuleNameMapper para manejar CSS, imágenes, etc. si es necesario:
  // moduleNameMapper: {
  //   "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  // },
};

module.exports = createJestConfig(customJestConfig);
