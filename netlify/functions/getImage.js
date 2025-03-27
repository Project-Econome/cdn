const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const filePath = path.join(__dirname, '../uploads', event.pathParameters.filename);
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: fileBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Image not found' }),
    };
  }
};
