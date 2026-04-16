import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/helpers';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className
}) => {
  const [isLoading, setIsLoading] = useState(!!src);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const showImage = src && !hasError;
  const showInitials = !showImage && name;
  const showIcon = !showImage && !showInitials;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-bg-hover text-text-secondary font-medium',
        sizeClasses[size],
        className
      )}
    >
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-bg-hover animate-pulse" />
      )}

      {/* Image */}
      {showImage && (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Initials fallback */}
      {showInitials && (
        <span className="select-none">
          {getInitials(name)}
        </span>
      )}

      {/* Icon fallback */}
      {showIcon && (
        <User className={iconSizes[size]} />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;
