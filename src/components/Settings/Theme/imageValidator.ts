interface ImageValidatorProps {
  maxSizeInMb?: number;
  maxSizeMessage?: string;
  minWidthInPixel?: number;
  minWidthMessage?: string;
  minHeightInPixel?: number;
  minHeightMessage?: string;
  minDimensionsMessage?: string;
}

export const imageValidator = ({
  maxSizeInMb,
  minWidthInPixel,
  minHeightInPixel,
  maxSizeMessage,
  minWidthMessage,
  minHeightMessage,
  minDimensionsMessage,
}: ImageValidatorProps) => async (file?: File) => {
  if (!file || !(file instanceof File)) {
    return;
  }

  if (maxSizeInMb > 0) {
    const totalBytes = file.size;
    if (maxSizeInMb * 1000000 < totalBytes) {
      return maxSizeMessage || 'Image size exceeded';
    }
  }

  if (minHeightInPixel || minWidthInPixel) {
    return new Promise<string | undefined>(resolve => {
      const reader = new FileReader();
      reader.onload = entry => {
        // The Image() constructor creates a new HTMLImageElement instance.
        var image = new Image();
        image.src = entry.target.result as string;
        image.onload = function() {
          const imgElement = this as HTMLImageElement;
          if (minWidthInPixel && minWidthInPixel > imgElement.width) {
            resolve(minWidthMessage || minDimensionsMessage || `Image must be wider than ${minWidthInPixel}px`);
          }
          if (minHeightInPixel && minHeightInPixel > imgElement.height) {
            resolve(minHeightMessage || minDimensionsMessage || `Image must be taller than ${minHeightInPixel}px`);
          }
          resolve(undefined);
        };
      };

      reader.readAsDataURL(file);
    });
  }
};
