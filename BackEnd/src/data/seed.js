const { inicializarLibros } = require('./database');

console.log('🌱 Inicializando datos de prueba...');

inicializarLibros();

console.log('✅ Datos de libros inicializados correctamente!');
console.log('📚 Los siguientes datos están disponibles:');
console.log('   - 24 libros de ejemplo en el catálogo');
console.log('');
console.log('💡 Para probar la API:');
console.log('   1. Ejecuta: npm start');
console.log('   2. Abre: http://localhost:3000/api-docs');
console.log('   3. Explora la documentación Swagger');
