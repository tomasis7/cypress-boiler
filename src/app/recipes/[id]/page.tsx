"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const recipeId = params.id as string;

  useEffect(() => {
    if (recipeId) {
      fetchRecipe();
    }
  }, [recipeId]);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recipes/${recipeId}`);
      const data = await res.json();
      
      if (res.ok) {
        setRecipe(data);
      } else {
        setError(data.error || 'Recipe not found');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Link href="/" style={{ color: 'blue' }}>← Tillbaka till startsidan</Link>
        <p>Laddar recept...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <Link href="/" style={{ color: 'blue' }}>← Tillbaka till startsidan</Link>
        <div style={{ color: 'red', marginTop: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error || 'Recipe not found'}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'blue' }}>← Tillbaka till startsidan</Link>
      
      <h1 style={{ marginTop: '20px', marginBottom: '10px' }}>{recipe.title}</h1>
      <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
        Av: {recipe.author.name}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '30px' }}>
        <div>
          <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Ingredienser</h2>
          <ul style={{ lineHeight: '1.6' }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Instruktioner</h2>
          <ol style={{ lineHeight: '1.6' }}>
            {recipe.instructions.map((instruction, index) => (
              <li key={index} style={{ marginBottom: '12px' }}>{instruction}</li>
            ))}
          </ol>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#666' }}>
          Njut av ditt recept! 🍽️
        </p>
      </div>
    </div>
  );
}