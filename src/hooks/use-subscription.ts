
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({ subscribed: false });
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user || !session) {
      console.log('No user or session, setting subscribed to false');
      setSubscriptionData({ subscribed: false });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Checking subscription for user:', user.email);
      
      // Primeiro, vamos verificar na tabela profiles se is_premium está definido
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error checking profile premium status:', profileError);
      } else {
        console.log('Profile premium status:', profileData?.is_premium);
        
        // Se já temos o status premium no perfil, use ele
        if (profileData?.is_premium === true) {
          console.log('User is premium according to profile');
          setSubscriptionData({ subscribed: true, subscription_tier: 'Premium' });
          setIsLoading(false);
          return;
        }
      }

      // Se não está no perfil ou é false, vamos verificar via Stripe
      console.log('Checking via Stripe API...');
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Stripe subscription check error:', error);
        // Em caso de erro na verificação, vamos assumir que não é premium
        setSubscriptionData({ subscribed: false });
      } else {
        console.log('Stripe subscription data:', data);
        setSubscriptionData(data);
      }
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      // Em caso de erro, vamos verificar localmente se há alguma indicação de premium
      setSubscriptionData({ subscribed: false });
      
      toast({
        title: "Erro ao verificar assinatura",
        description: "Não foi possível verificar sua assinatura. Tentando novamente...",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar o Premium",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Abrir Stripe Checkout em nova aba
      window.open(data.url, '_blank');
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Erro ao criar checkout",
        description: error.message || "Ocorreu um erro ao processar o pagamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Abrir portal do cliente em nova aba
      window.open(data.url, '_blank');
    } catch (error: any) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Erro ao abrir portal",
        description: error.message || "Ocorreu um erro ao abrir o portal de gerenciamento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && session) {
      console.log('User and session available, checking subscription...');
      checkSubscription();
    } else {
      console.log('No user or session, setting subscribed to false');
      setSubscriptionData({ subscribed: false });
    }
  }, [user, session]);

  return {
    subscriptionData,
    isLoading,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
