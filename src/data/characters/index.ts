/**
 * Cosmic Friends - Character Data Index
 *
 * Central export for all character data and utilities.
 */

import type { CosmicCharacter } from '@/types/character';

// Import character data
import zephyrData from './zephyr.json';
import novaData from './nova.json';
import adamData from './adam.json';
import eveData from './eve.json';

// Type-cast JSON imports
export const zephyr = zephyrData as CosmicCharacter;
export const nova = novaData as CosmicCharacter;
export const adam = adamData as CosmicCharacter;
export const eve = eveData as CosmicCharacter;

// All characters array
export const allCharacters: CosmicCharacter[] = [
  zephyr,
  nova,
  adam,
  eve,
];

// Character lookup by ID
export const charactersById: Record<string, CosmicCharacter> = {
  'cf-001': zephyr,
  'cf-002': nova,
  'cf-003': adam,
  'cf-004': eve,
};

// Character lookup by name (lowercase)
export const charactersByName: Record<string, CosmicCharacter> = {
  zephyr,
  nova,
  adam,
  eve,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get a character by ID
 */
export function getCharacterById(id: string): CosmicCharacter | undefined {
  return charactersById[id];
}

/**
 * Get a character by name (case-insensitive)
 */
export function getCharacterByName(name: string): CosmicCharacter | undefined {
  return charactersByName[name.toLowerCase()];
}

/**
 * Get characters by status
 */
export function getCharactersByStatus(
  status: CosmicCharacter['status']['current']
): CosmicCharacter[] {
  return allCharacters.filter((c) => c.status.current === status);
}

/**
 * Get characters by color theme
 */
export function getCharactersByColor(
  color: CosmicCharacter['identity']['color']
): CosmicCharacter[] {
  return allCharacters.filter((c) => c.identity.color === color);
}

/**
 * Get character display data for UI components (simplified view)
 */
export function getCharacterDisplayData(character: CosmicCharacter) {
  return {
    id: character.identity.id,
    number: character.identity.number,
    name: character.identity.name,
    role: character.identity.archetype,
    tagline: character.identity.tagline,
    color: character.identity.color,
    status: character.status.current,
    traits: character.personality.traits.labels,
    followers: character.status.stats.followers,
    earnings: character.economic.total_earnings,
    image: null, // Placeholder until images are generated
  };
}

/**
 * Get all characters as display data
 */
export function getAllCharactersDisplay() {
  return allCharacters.map(getCharacterDisplayData);
}

/**
 * Get character prompt config for image generation
 */
export function getCharacterPromptConfig(character: CosmicCharacter) {
  return {
    identity: character.identity,
    visual: character.visual,
    personality_context: {
      archetype: character.identity.archetype,
      traits: character.personality.traits.labels,
      vibe: character.visual.style.aesthetic,
    },
  };
}

// Default export
export default allCharacters;
