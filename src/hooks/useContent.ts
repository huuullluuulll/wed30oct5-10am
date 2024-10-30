import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useContent = (sectionKey: string) => {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: section } = await supabase
          .from('content_sections')
          .select('id')
          .eq('key', sectionKey)
          .single();

        if (section) {
          const { data, error } = await supabase
            .from('content_items')
            .select('*')
            .eq('section_id', section.id)
            .eq('is_active', true)
            .order('order_index');

          if (error) throw error;
          setContent(data || []);
        }
      } catch (err: any) {
        console.error('Error fetching content:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [sectionKey]);

  return { content, loading, error };
};

export const useServicePlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('service_plans')
          .select('*')
          .eq('is_active', true)
          .order('price');

        if (error) throw error;
        setPlans(data || []);
      } catch (err: any) {
        console.error('Error fetching plans:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
};

export const useDocumentTypes = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('document_types')
          .select('*')
          .eq('is_active', true)
          .order('price');

        if (error) throw error;
        setDocuments(data || []);
      } catch (err: any) {
        console.error('Error fetching document types:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return { documents, loading, error };
};

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('uk_calendar_events')
          .select('*')
          .eq('is_active', true)
          .order('date');

        if (error) throw error;
        setEvents(data || []);
      } catch (err: any) {
        console.error('Error fetching calendar events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};