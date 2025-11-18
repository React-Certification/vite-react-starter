import { Brain, Bone, Heart, Stethoscope, Activity } from 'lucide-react';

export const BODY_PARTS = [
  { id: 'chest', label: 'Chest', icon: Stethoscope },
  { id: 'neuroradiology', label: 'Neuroradiology', icon: Brain },
  { id: 'msk', label: 'MSK', icon: Bone },
  { id: 'cardiac', label: 'Cardiac', icon: Heart },
  { id: 'abdominal', label: 'Abdominal', icon: Activity },
  { id: 'pediatric', label: 'Pediatric', icon: Activity },
  { id: 'emergency', label: 'Emergency/Trauma', icon: Activity },
];

export const COMPLEXITY = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' },
];
