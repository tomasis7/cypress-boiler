
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

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

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{id: string, name: string, email: string} | null>(null);

  useEffect(() => {
    fetchRecipes();
    // Check if user is logged in (simple localStorage check)
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setRecipes(data);
      } else {
        console.error('API error:', data);
        setRecipes([]); // Keep as empty array on error
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setRecipes([]); // Keep as empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
        <h1>RecipeShare</h1>
        <nav style={{ marginTop: '10px' }}>
          {currentUser ? (
            <div>
              <span>Välkommen, {currentUser.name}! </span>
              <Link href="/create" style={{ marginRight: '10px', color: 'blue' }}>Skapa Recept</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                Logga ut
              </button>
            </div>
          ) : (
            <Link href="/login" style={{ color: 'blue' }}>Logga in / Registrera</Link>
          )}
        </nav>
      </header>

      <h2>Alla Recept</h2>
      
      {loading ? (
        <p>Laddar recept...</p>
      ) : recipes.length === 0 ? (
        <p>Inga recept ännu. <Link href="/create" style={{ color: 'blue' }}>Skapa det första receptet!</Link></p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {(recipes || []).map((recipe) => (
            <div key={recipe.id} style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h3>
                <Link href={`/recipes/${recipe.id}`} style={{ color: 'black', textDecoration: 'none' }}>
                  {recipe.title}
                </Link>
              </h3>
              <p style={{ color: '#666', fontSize: '14px' }}>
                Av: {recipe.author.name}
              </p>
              <p style={{ color: '#888', fontSize: '14px' }}>
                {recipe.ingredients.length} ingredienser • {recipe.instructions.length} steg
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}