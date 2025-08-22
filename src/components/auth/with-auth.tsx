
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import type { UserRole } from '@/lib/types';

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: UserRole[],
  redirectPath: string = '/admin/login'
) => {
  const WithAuthComponent = (props: P) => {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.replace(redirectPath);
        } else if (userProfile && !allowedRoles.includes(userProfile.role)) {
          // If role doesn't match, send them to the student homepage
          router.replace('/');
        }
      }
    }, [user, userProfile, loading, router, allowedRoles, redirectPath]);

    if (loading || !user || !userProfile || !allowedRoles.includes(userProfile.role)) {
      return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  
  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthComponent;
};

export default withAuth;
