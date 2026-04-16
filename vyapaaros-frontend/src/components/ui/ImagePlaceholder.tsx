import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface ImagePlaceholderProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string; // e.g., "16/9", "1/1", "4/3"
  className?: string;
  placeholderClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className,
  placeholderClassName,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    aspectRatio: aspectRatio
  };

  return (
    <div
      className={cn('relative overflow-hidden bg-bg-hover', className)}
      style={containerStyle}
    >
      {/* Placeholder shown while loading or on error */}
      {(isLoading || hasError) && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-bg-hover animate-pulse',
            placeholderClassName
          )}
        >
          <ImageIcon className="w-8 h-8 text-text-tertiary" />
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-text-tertiary">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs">Failed to load</span>
        </div>
      )}
    </div>
  );
};

ImagePlaceholder.displayName = 'ImagePlaceholder';

export default ImagePlaceholder;
