// Mock canvas and WebGL context
window.HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: (x, y, w, h) => ({
    data: new Array(w * h * 4)
  }),
  putImageData: () => {},
  createImageData: () => ([]),
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  restore: () => {},
  scale: () => {},
  rotate: () => {},
  translate: () => {},
  transform: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  stroke: () => {},
  fill: () => {},
  closePath: () => {}
});

// Mock AudioContext
window.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: () => ({
    connect: () => {},
    start: () => {},
    stop: () => {}
  }),
  createGain: () => ({
    connect: () => {},
    gain: { value: 0 }
  })
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock; 