import { imageValidator } from './imageValidator';

const testFile = new File([''], 'test.png', { type: 'image/png' });
const fileReader = {
  readAsDataURL: jest.fn(),
  onload: jest.fn(),
};
const image = {
  onload: jest.fn(),
  width: 10,
  height: 10,
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('Should ignore undefined input', async () => {
  expect(await imageValidator({})()).toBeUndefined();
});

it('Should validates file size', async () => {
  Object.defineProperty(testFile, 'size', {
    value: 2000, // 2kb
  });
  expect(
    await imageValidator({
      maxSizeInMb: 0.001, // 1kb
      maxSizeMessage: 'Too big',
    })(testFile)
  ).toEqual('Too big');
});

it('Should validates image width', async () => {
  jest.spyOn(global, 'FileReader' as any).mockImplementation(() => fileReader);
  setImmediate(() => {
    fileReader.onload({ target: { result: 'foo' } });
  });
  jest.spyOn(global, 'Image' as any).mockImplementation(() => image);
  setImmediate(() => {
    image.onload({ target: { result: 'foo' } });
  });

  expect(
    await imageValidator({
      minWidthInPixel: 50,
      minWidthMessage: 'Too small (width)',
    })(testFile)
  ).toEqual('Too small (width)');
});

it('Should validates image height', async () => {
  jest.spyOn(global, 'FileReader' as any).mockImplementation(() => fileReader);
  setImmediate(() => {
    fileReader.onload({ target: { result: 'foo' } });
  });
  jest.spyOn(global, 'Image' as any).mockImplementation(() => image);
  setImmediate(() => {
    image.onload({ target: { result: 'foo' } });
  });

  expect(
    await imageValidator({
      minHeightInPixel: 50,
      minHeightMessage: 'Too small (height)',
    })(testFile)
  ).toEqual('Too small (height)');
});
