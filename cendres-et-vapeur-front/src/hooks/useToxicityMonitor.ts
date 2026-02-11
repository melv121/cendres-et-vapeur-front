import { useEffect, useState } from 'react';

const API_BASE_URL = '';
const TOXICITY_THRESHOLD = 0.7; // Seuil de toxicité (70%)

const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const getColonyEvents = async () => {
    const response = await fetch(`${API_BASE_URL}/colony-events/toxicity/status`, {
        method: 'GET',
        credentials: 'include', 
        headers: getHeaders(),
    });
    
    if (!response.ok) {
        const text = await response.text();
        console.error('API Error:', response.status, text);
        throw new Error(`HTTP ${response.status}: ${text}`);
    }
    
    return response.json();
};

// Fonction pour calculer le niveau de toxicité basé sur les données de pollution
const calculateToxicityLevel = (pollution: any) => {
  if (!pollution) return 0;
  
  const { sulfur = 0, carbon_dioxide = 0, particulates = 0, oxygen = 21 } = pollution;
  
  // Calculer la toxicité basée sur les niveaux de pollution
  // Soufre: >50 ppm est dangereux
  // CO2: >1000 ppm (1%) est préoccupant  
  // Particules: >150 µg/m³ est dangereux
  // Oxygène: <19% est préoccupant
  
  let toxicityScore = 0;
  
  // Soufre (0-100 scale)
  toxicityScore += Math.min(sulfur / 50, 1) * 0.3;
  
  // CO2 (0-100 scale) - convertir % en ppm pour le calcul
  toxicityScore += Math.min((carbon_dioxide * 10) / 1000, 1) * 0.3;
  
  // Particules (0-100 scale)
  toxicityScore += Math.min(particulates / 150, 1) * 0.3;
  
  // Oxygène (inverse - moins d'oxygène = plus de toxicité)
  if (oxygen < 19) {
    toxicityScore += ((19 - oxygen) / 2) * 0.1;
  }
  
  return Math.min(toxicityScore, 1);
};

export function useToxicityMonitor() {
  const [isToxic, setIsToxic] = useState(false);
  const [toxicityLevel, setToxicityLevel] = useState(0);
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    const checkToxicity = async () => {
      try {
        // Récupérer les données depuis l'API
        const data = await getColonyEvents();
        setApiData(data);
        
        // Calculer le niveau de toxicité basé sur les données de pollution
        const calculatedToxicity = calculateToxicityLevel(data.pollution);
        setToxicityLevel(calculatedToxicity);
        
        // Vérifier si le seuil est dépassé
        if (calculatedToxicity > TOXICITY_THRESHOLD) {
          setIsToxic(true);
          document.body.classList.add('toxic');
        } else {
          setIsToxic(false);
          document.body.classList.remove('toxic');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de pollution:', error);
        // En cas d'erreur, simuler une valeur aléatoire
        const randomToxicity = Math.random();
        setToxicityLevel(randomToxicity);
        
        if (randomToxicity > TOXICITY_THRESHOLD) {
          setIsToxic(true);
          document.body.classList.add('toxic');
        } else {
          setIsToxic(false);
          document.body.classList.remove('toxic');
        }
      }
    };

    // Vérifier toutes les 2 secondes
    const interval = setInterval(checkToxicity, 2000);
    
    // Vérification initiale
    checkToxicity();

    return () => {
      clearInterval(interval);
      // Nettoyer les classes au démontage
      document.body.classList.remove('toxic');
    };
  }, []);

  return { isToxic, toxicityLevel, threshold: TOXICITY_THRESHOLD, apiData };
}