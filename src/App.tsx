import React, { useState } from 'react';

const App = () => {
  // State for the uploaded image
  const [image, setImage] = useState<string | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);  // Set the image source after reading the file
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="App">
      <h1>Meme Generator</h1>
      {/* File input for image upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {/* Display the uploaded image */}
      {image && <img src={image} alt="Uploaded meme" width="500" />}
    </div>
  );
};

export default App;
