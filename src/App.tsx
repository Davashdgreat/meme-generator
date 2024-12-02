import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>('');
  const [bottomText, setBottomText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(40);
  const [textColor, setTextColor] = useState<string>('white');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const drawMeme = () => {
    if (!canvasRef.current || !image) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Add top text
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      ctx.fillText(topText, canvas.width / 2, 50);
      ctx.strokeText(topText, canvas.width / 2, 50);

      // Add bottom text
      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
    };
  };

  useEffect(() => {
    drawMeme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, topText, bottomText, fontSize, textColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-2xl font-bold mb-5">Meme Generator</h1>

      {/* File upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {/* Text inputs */}
      <div className="mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Top text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Bottom text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Customization options */}
      <div className="mb-4 w-full max-w-md flex flex-wrap gap-4">
        <div className="flex flex-col">
          <label htmlFor="fontSize" className="mb-1 text-sm">
            Font Size:
          </label>
          <input
            id="fontSize"
            type="number"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="p-2 border rounded"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="textColor" className="mb-1 text-sm">
            Text Color:
          </label>
          <input
            id="textColor"
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="border rounded shadow-md mb-4" />

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download Meme
      </button>
    </div>
  );
};

export default App;
