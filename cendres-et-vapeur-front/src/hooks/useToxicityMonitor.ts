import { useEffect, useState } from 'react';


const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || '');
const TOXICITY_THRESHOLD = 0.95;

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

const calculateToxicityLevel = (pollution: any) => {
  if (!pollution) return 0;
  
  const { sulfur = 0, carbon_dioxide = 0, particulates = 0, oxygen = 21 } = pollution;  
  let toxicityScore = 0;

  toxicityScore += Math.min(sulfur / 50, 1) * 0.3;
  toxicityScore += Math.min((carbon_dioxide * 10) / 1000, 1) * 0.3;
  toxicityScore += Math.min(particulates / 150, 1) * 0.3;

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
        const data = await getColonyEvents();
        setApiData(data);
        
        const calculatedToxicity = calculateToxicityLevel(data.pollution);
        setToxicityLevel(calculatedToxicity);
        
        if (calculatedToxicity > TOXICITY_THRESHOLD) {
          setIsToxic(true);
          document.body.classList.add('toxic');
        } else {
          setIsToxic(false);
          document.body.classList.remove('toxic');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de pollution:', error);
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

    const interval = setInterval(checkToxicity, 2000);
    
    checkToxicity();

    return () => {
      clearInterval(interval);
      document.body.classList.remove('toxic');
    };
  }, []);

  return { isToxic, toxicityLevel, threshold: TOXICITY_THRESHOLD, apiData };
}