// 29 seconds of story + 0.6 seconds of final crossfade: under 30 seconds total.
export const DURATION = 29;
export const STORAGE_KEY = "quantum-nova:cinematic:v1";

export const shots = [
  { start: 0, end: 3, name: "Infinitos destinos", color: "#22d3ee", scale: [1.12, .94], x: [-2, 2], y: [2, -2] },
  { start: 3, end: 7, name: "El descubrimiento", color: "#facc15", scale: [.9, 1.12], x: [3, -3], y: [-2, 3] },
  { start: 7, end: 10, name: "La fractura", color: "#ec4899", scale: [1.1, .98], x: [-3, 3], y: [2, -3] },
  { start: 10, end: 15, name: "La Agencia de Control Universal", color: "#ef4444", scale: [.85, 1.08], x: [0, 0], y: [3, -2] },
  { start: 15, end: 20, name: "Un futuro prohibido", color: "#ef4444", scale: [.94, 1.04], x: [0, -4], y: [-3, 2] },
  { start: 20, end: 25, name: "La Rebelión Cuántica", color: "#7c3aed", scale: [1.12, .96], x: [2, -2], y: [3, -2] },
  { start: 25, end: 29, name: "Tu decisión lo cambia todo", color: "#22d3ee", scale: [1.18, 1], x: [-3, 0], y: [-3, 0] },
];

export const cues = [
  { start: 0, end: 3, text: "Infinitos universos vivían en paz. Cada uno, su destino." },
  { start: 3, end: 7, text: "La ciencia abrió portales entre mundos. Todo parecía posible." },
  { start: 7, end: 10, text: "Las alianzas se rompieron. El multiverso ardió." },
  { start: 10, end: 15, text: "La Agencia de Control Universal impuso la paz: una sola realidad." },
  { start: 15, end: 20, text: "Cada nuevo futuro era una Superadox. La Agencia decidió borrarlos." },
  { start: 20, end: 25, text: "Científicos y guerreros formaron la Rebelión Cuántica para salvar los mundos." },
  { start: 25, end: 29, text: "Recluta: tu poder cuántico puede salvarlos. ¿Te unes a la Rebelión?", speaker: "Transmisión rebelde" },
];

export function shotAt(seconds: number) {
  return Math.max(0, shots.findIndex(shot => seconds >= shot.start && seconds < shot.end));
}
