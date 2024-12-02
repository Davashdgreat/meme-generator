import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [topText, setTopText] = useState<string>('');
  const [bottomText, setBottomText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(40);
  const [textColor, setTextColor] = useState<string>('white');
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [draggingText, setDraggingText] = useState<'top' | 'bottom' | null>(null);
  const [topPosition, setTopPosition] = useState({ x: 0, y: 50 });
  const [bottomPosition, setBottomPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };
  

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const { offsetY } = e.nativeEvent;

    if (Math.abs(offsetY - topPosition.y) < 30) {
      setDraggingText('top');
      setIsDragging(true);
    } else if (Math.abs(offsetY - bottomPosition.y) < 30) {
      setDraggingText('bottom');
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingText || !canvasRef.current) return;

    const { offsetX, offsetY } = e.nativeEvent;

    if (draggingText === 'top') {
      setTopPosition({ x: offsetX, y: offsetY });
    } else if (draggingText === 'bottom') {
      setBottomPosition({ x: offsetX, y: offsetY });
    }
  };

  const handleMouseUp = () => {
    setDraggingText(null);
    setIsDragging(false);
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

      // Adjust initial positions for first render
      setBottomPosition({ x: img.width / 2, y: img.height - 20 });
      setTopPosition({ x: img.width / 2, y: 50 });

      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Text styles
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = textColor;
      ctx.textAlign = alignment;
      ctx.strokeStyle = isDragging ? 'red' : 'black'; // NEW: Red stroke when dragging
      ctx.lineWidth = isDragging ? 4 : 2; // NEW: Thicker stroke during drag

      // Draw top text
      ctx.fillText(topText, topPosition.x || canvas.width / 2, topPosition.y || 50);
      ctx.strokeText(topText, topPosition.x || canvas.width / 2, topPosition.y || 50);

      // Draw bottom text
      ctx.fillText(bottomText, bottomPosition.x || canvas.width / 2, bottomPosition.y || canvas.height - 20);
      ctx.strokeText(bottomText, bottomPosition.x || canvas.width / 2, bottomPosition.y || canvas.height - 20);
    };
  };

  useEffect(() => {
    drawMeme();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, topText, bottomText, fontSize, textColor, alignment, topPosition, bottomPosition]);

  const handleDownload = () => {
    if (!canvasRef.current || !image) {
      alert('Please upload an image before downloading.');
      return;
    }
  
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };
  

  const handleReset = () => {
    setImage(null);
    setTopText('');
    setBottomText('');
    setFontSize(40);
    setTextColor('white');
    setAlignment('center');
    setTopPosition({ x: 0, y: 50 });
    setBottomPosition({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 p-5 text-gray-100">
      <h1 className="text-2xl font-bold mb-5 ">𝕞ｅＭẸ ＧⒺηє𝐑ᵃŦⓄ𝔯</h1>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border rounded shadow-md mb-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {/* File upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-4"
      />

      {/* Text inputs */}
      <div className="mb-4 w-full max-w-md text-gray-900">
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
          <label htmlFor="fontSize" className="mb-1 text-sm ">
            Font Size:
          </label>
          <input
            id="fontSize"
            type="number"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="p-2 border rounded text-gray-900"
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
        <div className="flex flex-col">
          <label className="mb-1 text-sm">Alignment:</label>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((align) => (
              <label key={align}>
                <input
                  type="radio"
                  value={align}
                  checked={alignment === align}
                  onChange={(e) => setAlignment(e.target.value as 'left' | 'center' | 'right')}
                  className="mr-1"
                />
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flx-col justify-between gap-9">
        {/* Download button */}
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download Meme
      </button>

      {/* Reset button */}
      <button
          onClick={handleReset}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

    </div>
  );
};

export default App;
