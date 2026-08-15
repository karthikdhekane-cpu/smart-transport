'use client';

import { useState, useEffect, useCallback } from 'react';
import { RouteOptimizationRecommendation, RouteEfficiencyScore } from '../types/index';
import { routeOptimizationService } from '../services/RouteOptimizationService';

export function useRouteOptimization(busId?: string) {
  const [recommendations, setRecommendations] = useState<RouteOptimizationRecommendation[]>([]);
  const [efficiencyScores, setEfficiencyScores] = useState<RouteEfficiencyScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const scores = routeOptimizationService.getRouteEfficiencyScores();
      setEfficiencyScores(scores);

      if (busId) {
        const rec = await routeOptimizationService.getRecommendationsForBus(busId);
        setRecommendations(rec ? [rec] : []);
      } else {
        const all = await routeOptimizationService.getAllRecommendations();
        setRecommendations(all);
      }
    } finally {
      setIsLoading(false);
    }
  }, [busId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { recommendations, efficiencyScores, isLoading, refresh };
}
