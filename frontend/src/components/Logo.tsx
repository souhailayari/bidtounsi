import { Car } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'white';
}

export function Logo({ size = 'md', showText = true, variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 sm:w-10 sm:h-10',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4 sm:w-5 sm:h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const bgColor = variant === 'white' ? 'bg-white' : 'bg-primary';
  const iconColor = variant === 'white' ? 'text-primary' : 'text-white';
  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900';

  return (
    <div className="flex items-center space-x-2 sm:space-x-3">
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} ${bgColor} rounded-lg flex items-center justify-center shadow-sm flex-shrink-0`}>
        <Car className={`${iconSizes[size]} ${iconColor}`} />
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex-shrink-0">
          <h1 className={`${textSizes[size]} font-bold ${textColor} whitespace-nowrap`}>
            BidTounsi
          </h1>
          {size !== 'sm' && (
            <p className={`text-xs ${variant === 'white' ? 'text-blue-100' : 'text-gray-600'} hidden sm:block`}>
              Vente & Achat de véhicules
            </p>
          )}
        </div>
      )}
    </div>
  );
}
