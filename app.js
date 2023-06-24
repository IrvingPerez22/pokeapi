const express = require('express');
const axios = require('axios');
const app = express();

// Primer endpoint - GET /pokemons
app.get('/pokemons', async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    let url = 'https://pokeapi.co/api/v2/pokemon?';

    // Agregar parámetros al query de la URL según los valores proporcionados
    if (search) {
      url += `&name=${search}`;
    }
    if (limit && page) {
      const offset = (page - 1) * limit;
      url += `&offset=${offset}&limit=${limit}`;
    }

    // Hacer la solicitud a la Pokeapi
    const response = await axios.get(url);
    const results = response.data.results;

    // Obtener los nombres de los pokemons y ordenarlos alfabéticamente
    const pokemons = results.map(pokemon => pokemon.name).sort();

    res.json(pokemons);
  } catch (error) {
    console.error('Ocurrió un error:', error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Segundo endpoint - POST /pokemon/pdf
app.post('/pokemon/pdf', async (req, res) => {
  try {
    const { name } = req.body;

    // Validar si el nombre del pokemon existe
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const pokemon = response.data;

    // Generar el archivo PDF con la información básica del pokemon
    const pdfContent = `
      Nombre: ${pokemon.name}
      ID: ${pokemon.id}
      Altura: ${pokemon.height}
      Peso: ${pokemon.weight}
    `;

    // Configurar los encabezados para la descarga del archivo PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${pokemon.name}.pdf`);

    // Enviar el contenido del archivo PDF como respuesta
    res.send(pdfContent);
  } catch (error) {
    console.error('Ocurrió un error:', error.message);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'Pokemon no encontrado' });
    } else {
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
});

// Iniciar el servidor en el puerto 80
app.listen(80, () => {
    console.log('Servidor iniciado en el puerto 80, 433');
  });
