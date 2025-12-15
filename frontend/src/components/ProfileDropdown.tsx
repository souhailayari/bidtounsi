import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { User as UserType } from '../types';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Plus,
  FileText
} from 'lucide-react';

interface ProfileDropdownProps {
  user: UserType;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function ProfileDropdown({ user, onNavigate, onLogout }: ProfileDropdownProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserTypeLabel = (type: string) => {
    const labels = {
      admin: 'Administrateur',
      vendeur: 'Vendeur',
      acheteur: 'Acheteur',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getUserTypeColor = (type: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-700',
      vendeur: 'bg-blue-100 text-blue-700',
      acheteur: 'bg-green-100 text-green-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="flex items-center space-x-2 sm:space-x-3 rounded-full hover:bg-gray-100 px-2 sm:px-3 py-1 sm:py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
          aria-label="Menu utilisateur"
        >
          <div className="relative">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/20 group-hover:border-primary/40 transition-all">
              <AvatarImage src={user.profilePhoto} alt={user.companyName} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {getInitials(user.companyName)}
              </AvatarFallback>
            </Avatar>
            {/* Indicateur en ligne (point vert) */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] group-hover:text-primary transition-colors">
              {user.companyName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {getUserTypeLabel(user.userType)}
            </p>
          </div>
          
          <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block group-hover:text-primary transition-all group-hover:translate-y-0.5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-white/98 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 p-2 dropdown-content-appear"
        sideOffset={8}
      >
        {/* En-tête avec gradient */}
        <DropdownMenuLabel className="px-3 py-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mb-2">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={user.profilePhoto} alt={user.companyName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                {getInitials(user.companyName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.companyName}</p>
              <p className="text-xs text-gray-600 truncate">{user.email}</p>
              <div className="mt-1.5">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getUserTypeColor(user.userType)}`}>
                  {getUserTypeLabel(user.userType)}
                </span>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5 bg-gray-200" />

        {/* Options principales */}
        <div className="space-y-0.5">
          <DropdownMenuItem
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 focus:bg-blue-50 transition-all group"
          >
            <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-900">Tableau de bord</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 focus:bg-purple-50 transition-all group"
          >
            <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-900">Mon profil</span>
          </DropdownMenuItem>

          {/* Option spéciale vendeur */}
          {user.userType === 'vendeur' && (
            <DropdownMenuItem
              onClick={() => onNavigate('publish-vehicle')}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 focus:bg-green-50 transition-all group"
            >
              <div className="p-1.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Plus className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-900">Publier annonce</span>
            </DropdownMenuItem>
          )}

          {/* Option spéciale admin */}
          {user.userType === 'admin' && (
            <DropdownMenuItem
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 focus:bg-orange-50 transition-all group"
            >
              <div className="p-1.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-orange-900">Rapports</span>
            </DropdownMenuItem>
          )}
        </div>

        <DropdownMenuSeparator className="my-1.5 bg-gray-200" />

        {/* Déconnexion */}
        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 focus:bg-red-50 transition-all group"
        >
          <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
            <LogOut className="w-4 h-4 text-red-600" />
          </div>
          <span className="text-sm font-medium text-red-600 group-hover:text-red-700">Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
