import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';

type Example = {
  id: number;
  created_at: string;
  name: string;
};

export default function ExampleComponent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Example[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // This is an example query - you'll need to replace 'example_table'
      // with your actual table name once you've set up Supabase
      const { data, error } = await supabase
        .from('example_table')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setData(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <>
          <Text style={styles.title}>Data from Supabase:</Text>
          {data.length === 0 ? (
            <Text>No data found</Text>
          ) : (
            data.map((item) => (
              <Text key={item.id} style={styles.item}>
                {item.name}
              </Text>
            ))
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  errorText: {
    color: 'red',
  },
}); 