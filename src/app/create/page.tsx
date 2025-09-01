"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<{id: string, name: string, email: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else {
      router.push('/login');
    }
  }, [router]);

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError("Du måste vara inloggad för att skapa recept");
      return;
    }

    const filteredIngredients = ingredients.filter(ing => ing.trim() !== "");
    const filteredInstructions = instructions.filter(inst => inst.trim() !== "");

    if (!title.trim() || filteredIngredients.length === 0 || filteredInstructions.length === 0) {
      setError("Alla fält måste fyllas i");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          ingredients: filteredIngredients,
          instructions: filteredInstructions,
          authorId: currentUser.id
        })
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Laddar...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1>
        <Link href="/" style={{ color: 'black', textDecoration: 'none' }}>RecipeShare</Link>
      </h1>
      
      <h2>Skapa Nytt Recept</h2>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label htmlFor="title">Recepttitel:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="t.ex. Mormors Pannkakor"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label>Ingredienser:</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder={`Ingrediens ${index + 1}`}
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  style={{ padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Ta bort
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            style={{ marginTop: '10px', padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            + Lägg till ingrediens
          </button>
        </div>

        <div>
          <label>Instruktioner:</label>
          {instructions.map((instruction, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
              <textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Steg ${index + 1}`}
                rows={2}
                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  style={{ padding: '8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Ta bort
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            style={{ marginTop: '10px', padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            + Lägg till steg
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Skapar recept...' : 'Skapa Recept'}
        </button>
      </form>
    </div>
  );
}