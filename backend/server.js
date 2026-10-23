const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config(); 

const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// 2. Middlewares globales 
app.use(cors()); 
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/posts', require('./routes/postRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/comments', require('./routes/commentRoutes'));
// app.use('/api/materials', require('./routes/materialRoutes'));
// app.use('/api/contact', require('./routes/contactRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

// 5. Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🙏 API del blog cristiano funcionando' });
});

// 6. 404 para rutas que no existen (debe ir DESPUÉS de todas las rutas)
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// 7. Conectamos a MongoDB y arrancamos el servidor
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});
