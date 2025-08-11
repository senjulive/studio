'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { 
  navigationCategories, 
  getNavigationByRole, 
  getNavigationByTier,
  findNavigationItem,
  getBreadcrumbs,
  searchNavigation,
  type NavigationCategory,
  type NavigationItem
} from '@/lib/navigation';

interface NavigationContextType {
  categories: NavigationCategory[];
  currentItem: NavigationItem | null;
  breadcrumbs: Array<{
    name: string;
    href: string;
    current: boolean;
    icon?: React.ComponentType<any>;
  }>;
  expandedCategories: Set<string>;
  searchQuery: string;
  searchResults: (NavigationItem & { category: string })[];
  isSearching: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  
  // Actions
  toggleCategory: (categoryId: string) => void;
  setSearchQuery: (query: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  clearSearch: () => void;
}

interface NavigationProviderProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'moderator' | 'user';
  userTier?: number;
}

const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ 
  children, 
  userRole = 'user', 
  userTier = 1 
}: NavigationProviderProps) {
  const pathname = usePathname();
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(navigationCategories.filter(cat => cat.defaultExpanded).map(cat => cat.id))
  );
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Get filtered navigation based on user role and tier
  const categories = React.useMemo(() => {
    let filteredCategories = getNavigationByRole(userRole);
    filteredCategories = getNavigationByTier(userTier);
    return filteredCategories;
  }, [userRole, userTier]);

  // Find current navigation item
  const currentItem = React.useMemo(() => {
    return findNavigationItem(pathname);
  }, [pathname]);

  // Generate breadcrumbs
  const breadcrumbs = React.useMemo(() => {
    return getBreadcrumbs(pathname);
  }, [pathname]);

  // Search functionality
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchNavigation(searchQuery);
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  // Actions
  const toggleCategory = React.useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  const handleSetSearchQuery = React.useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = React.useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleSetSidebarCollapsed = React.useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  }, []);

  const handleSetMobileMenuOpen = React.useCallback((open: boolean) => {
    setMobileMenuOpen(open);
  }, []);

  // Close mobile menu on navigation
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Auto-expand category containing current item
  React.useEffect(() => {
    if (currentItem) {
      for (const category of categories) {
        if (category.items.some(item => item.id === currentItem.id)) {
          if (category.isCollapsible) {
            setExpandedCategories(prev => new Set([...prev, category.id]));
          }
          break;
        }
      }
    }
  }, [currentItem, categories]);

  const value: NavigationContextType = {
    categories,
    currentItem,
    breadcrumbs,
    expandedCategories,
    searchQuery,
    searchResults,
    isSearching,
    sidebarCollapsed,
    mobileMenuOpen,
    toggleCategory,
    setSearchQuery: handleSetSearchQuery,
    setSidebarCollapsed: handleSetSidebarCollapsed,
    setMobileMenuOpen: handleSetMobileMenuOpen,
    clearSearch
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = React.useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Hook for navigation state management
export function useNavigationState() {
  const navigation = useNavigation();
  
  return {
    // Navigation data
    categories: navigation.categories,
    currentItem: navigation.currentItem,
    breadcrumbs: navigation.breadcrumbs,
    
    // Search
    searchQuery: navigation.searchQuery,
    searchResults: navigation.searchResults,
    isSearching: navigation.isSearching,
    setSearchQuery: navigation.setSearchQuery,
    clearSearch: navigation.clearSearch,
    
    // UI state
    sidebarCollapsed: navigation.sidebarCollapsed,
    mobileMenuOpen: navigation.mobileMenuOpen,
    expandedCategories: navigation.expandedCategories,
    
    // Actions
    toggleCategory: navigation.toggleCategory,
    setSidebarCollapsed: navigation.setSidebarCollapsed,
    setMobileMenuOpen: navigation.setMobileMenuOpen
  };
}

// Hook for getting page information
export function usePageInfo() {
  const navigation = useNavigation();
  
  const getPageTitle = React.useCallback(() => {
    if (navigation.currentItem) {
      return navigation.currentItem.label;
    }
    
    const lastBreadcrumb = navigation.breadcrumbs[navigation.breadcrumbs.length - 1];
    return lastBreadcrumb?.name || 'Dashboard';
  }, [navigation.currentItem, navigation.breadcrumbs]);

  const getPageDescription = React.useCallback(() => {
    return navigation.currentItem?.description || '';
  }, [navigation.currentItem]);

  const getPageIcon = React.useCallback(() => {
    return navigation.currentItem?.icon;
  }, [navigation.currentItem]);

  return {
    title: getPageTitle(),
    description: getPageDescription(),
    icon: getPageIcon(),
    breadcrumbs: navigation.breadcrumbs,
    currentItem: navigation.currentItem
  };
}
