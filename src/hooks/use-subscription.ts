
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
    if (!user || !session) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      setSubscriptionData(data);
    } catch (error: any) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Erro ao verificar assinatura",
        description: error.message || "Ocorreu um erro ao verificar sua assinatura",
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
      checkSubscription();
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
