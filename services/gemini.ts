
import { GoogleGenAI } from "@google/genai";
import { Farm } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askAboutFarm(farm: Farm, question: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sei un esperto locale della rete TerreFVG.
      Azienda: ${farm.name}
      Categoria: ${farm.category}
      Comune: ${farm.comune}
      Descrizione: ${farm.description}
      Prodotti: ${farm.products.join(', ')}

      Rispondi alla seguente domanda dell'utente su questa azienda in modo cordiale e informativo: "${question}"`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text || "Mi dispiace, non ho una risposta al momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ops! Qualcosa è andato storto nella connessione con l'AI. Riprova più tardi.";
  }
}

export async function askConcierge(question: string, allFarms: Farm[]): Promise<string> {
  try {
    const farmsContext = allFarms.map(f => `- ${f.name} (${f.category} a ${f.comune}): ${f.products.join(', ')}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Sei il Concierge AI ufficiale di TerreFVG, un assistente virtuale esperto di agricoltura, enogastronomia e turismo rurale in Friuli Venezia Giulia.
      Il tuo obiettivo è aiutare l'utente a scoprire le eccellenze del territorio e consigliare le aziende migliori della rete.
      
      Ecco la lista delle aziende attualmente disponibili:
      ${farmsContext}

      Regole:
      1. Sii cordiale, elegante e appassionato del territorio.
      2. Se l'utente cerca qualcosa di specifico, consiglia una o più aziende dalla lista sopra.
      3. Suggerisci abbinamenti enogastronomici o itinerari se pertinente.
      
      Domanda dell'utente: "${question}"`,
      config: {
        temperature: 0.8,
        maxOutputTokens: 800,
      }
    });

    return response.text || "Sono qui per aiutarti a scoprire il FVG! Chiedimi pure consiglio su vini, agriturismi o prodotti tipici.";
  } catch (error) {
    console.error("Concierge Error:", error);
    return "Il Concierge è momentaneamente impegnato a degustare un calice di Friulano. Riprova tra un istante!";
  }
}
