import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseQuery = (table, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { limit = null, orderBy = null, ascending = false, filter = null, eq = null } = options;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from(table).select('*');

        if (filter) {
          query = filter(query);
        } else if (eq) {
          query = query.eq(eq.column, eq.value);
        }

        if (orderBy) {
          query = query.order(orderBy, { ascending });
        }
        
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) throw error;
        setData(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options)]);

  return { data, loading, error };
};

export const useSupabaseSubscription = (table, onUpdate) => {
  useEffect(() => {
    const channel = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table: table }, (payload) => {
        onUpdate(payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onUpdate]);
};
