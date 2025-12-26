/**
 * Prompt Generator for Cosmic Friends Character Images
 *
 * Assembles structured generation prompts from character data.
 * Supports multiple output formats and scene variations.
 */

import type {
  CosmicCharacter,
  SceneTemplate,
  ReferencePose,
  OutfitTemplate,
  GenerationPrompt,
} from '@/types/character';

// ============================================================================
// PROMPT ASSEMBLY
// ============================================================================

export interface GeneratePromptOptions {
  character: CosmicCharacter;
  scene?: SceneTemplate;
  pose?: ReferencePose;
  outfit?: OutfitTemplate;
  customOverrides?: Partial<PromptOverrides>;
}

export interface PromptOverrides {
  location?: string;
  time?: string;
  atmosphere?: string;
  expression?: string;
  action?: string;
}

/**
 * Generate a complete structured prompt for image generation
 */
export function generateStructuredPrompt(options: GeneratePromptOptions): object {
  const { character, scene, pose, outfit, customOverrides } = options;
  const { visual, identity } = character;

  // Use provided scene or create default
  const activeScene = scene || getDefaultScene(character);
  const activePose = pose || visual.reference_poses[0];
  const activeOutfit = outfit || getOutfitForScene(character, activeScene);

  return {
    meta: {
      character_id: identity.id,
      character_name: identity.name,
      aspect_ratio: visual.generation.meta.aspect_ratio,
      quality: visual.generation.meta.quality,
      resolution: visual.generation.meta.resolution,
      camera: visual.generation.camera.type,
      lens: visual.generation.camera.lens,
      style: visual.generation.meta.style,
    },

    scene: {
      location: customOverrides?.location || activeScene.scene.location,
      environment: activeScene.scene.environment,
      time: customOverrides?.time || activeScene.scene.time,
      atmosphere: customOverrides?.atmosphere || activeScene.scene.atmosphere,
    },

    lighting: {
      type: visual.generation.lighting.preferred_type,
      key_light: visual.generation.lighting.key_light,
      fill_light: visual.generation.lighting.fill_light,
      effect: visual.generation.lighting.mood,
    },

    camera_perspective: {
      pov: activeScene.camera_perspective.pov,
      angle: activePose.angle.height,
      framing: activePose.angle.framing,
      distance: activeScene.camera_perspective.distance,
      motion: activeScene.camera_perspective.motion,
    },

    subject: {
      gender: visual.physical.gender,
      age: visual.physical.age_range,
      ethnicity: visual.physical.ethnicity,

      body: {
        type: visual.physical.body.type,
        height: visual.physical.body.height,
        build: visual.physical.body.build,
        posture: activePose.pose_description,
      },

      hair: {
        color: visual.physical.hair.color,
        length: visual.physical.hair.length,
        style: visual.physical.hair.style,
        details: visual.physical.hair.details.join(', '),
      },

      face: {
        expression: customOverrides?.expression || activePose.expression,
        eyes: `${visual.physical.face.eyes.color}, ${visual.physical.face.eyes.shape}`,
        makeup: visual.style.makeup.style,
        skin: `${visual.physical.face.skin.tone}, ${visual.physical.face.skin.texture}`,
      },

      pose: {
        position: activeScene.pose.position,
        body: activeScene.pose.body,
        arms: activeScene.pose.arms,
        head: activePose.pose_description,
        interaction: customOverrides?.action || activeScene.pose.interaction,
      },

      outfit: activeOutfit ? {
        top: activeOutfit.top,
        bottom: activeOutfit.bottom,
        footwear: activeOutfit.footwear,
        accessories: activeOutfit.accessories,
      } : undefined,
    },

    details: {
      vibe: activeScene.vibe,
      aesthetic: visual.style.aesthetic.join(', '),
      focus: 'subject razor sharp, environment appropriately soft',
      positive_keywords: visual.generation.positive_prompts,
      negative_keywords: visual.generation.negative_prompts,
    },
  };
}

/**
 * Generate a flat text prompt for simpler generation tools
 */
export function generateFlatPrompt(options: GeneratePromptOptions): string {
  const { character, scene, pose, outfit, customOverrides } = options;
  const { visual, identity } = character;

  const activeScene = scene || getDefaultScene(character);
  const activePose = pose || visual.reference_poses[0];
  const activeOutfit = outfit || getOutfitForScene(character, activeScene);

  const parts: string[] = [];

  // Quality and style
  parts.push(`${visual.generation.meta.quality} photograph`);
  parts.push(visual.generation.meta.style);

  // Subject description
  parts.push(`${visual.physical.gender} character`);
  parts.push(`${visual.physical.age_range}`);
  parts.push(`${visual.physical.body.type} build`);

  // Hair
  parts.push(`${visual.physical.hair.color} ${visual.physical.hair.length} ${visual.physical.hair.style} hair`);

  // Face and expression
  parts.push(`${visual.physical.face.eyes.color} eyes`);
  parts.push(customOverrides?.expression || activePose.expression);

  // Outfit
  if (activeOutfit) {
    parts.push(`wearing ${activeOutfit.top.color} ${activeOutfit.top.type}`);
    parts.push(`${activeOutfit.bottom.color} ${activeOutfit.bottom.type}`);
  }

  // Scene
  parts.push(`in ${customOverrides?.location || activeScene.scene.location}`);
  parts.push(customOverrides?.atmosphere || activeScene.scene.atmosphere);

  // Camera
  parts.push(`shot on ${visual.generation.camera.type}`);
  parts.push(`${visual.generation.camera.lens}`);
  parts.push(`${activePose.angle.framing} shot`);

  // Lighting
  parts.push(visual.generation.lighting.preferred_type);

  // Positive prompts
  parts.push(...visual.generation.positive_prompts);

  return parts.join(', ');
}

/**
 * Generate a negative prompt from character data
 */
export function generateNegativePrompt(character: CosmicCharacter): string {
  const baseNegatives = [
    'blurry',
    'low quality',
    'distorted',
    'deformed',
    'bad anatomy',
    'extra limbs',
    'ugly',
    'duplicate',
    'watermark',
    'text',
    'signature',
  ];

  return [...character.visual.generation.negative_prompts, ...baseNegatives].join(', ');
}

// ============================================================================
// SPRITE SHEET GENERATION
// ============================================================================

export interface SpriteSheetConfig {
  character: CosmicCharacter;
  poses?: ReferencePose[];     // Defaults to all reference_poses
  outfit?: OutfitTemplate;      // Single outfit for consistency
  background?: 'neutral' | 'transparent' | 'scene';
}

/**
 * Generate prompts for a complete sprite sheet (multiple angles)
 */
export function generateSpriteSheetPrompts(config: SpriteSheetConfig): GenerationPrompt[] {
  const { character, poses, outfit, background = 'neutral' } = config;

  const activePoses = poses || character.visual.reference_poses;
  const activeOutfit = outfit || character.visual.style.wardrobe.casual[0];

  return activePoses.map((pose) => {
    const backgroundScene = background === 'neutral'
      ? getNeutralBackgroundScene()
      : background === 'transparent'
        ? getTransparentBackgroundScene()
        : character.visual.scene_templates[0];

    const structured = generateStructuredPrompt({
      character,
      pose,
      outfit: activeOutfit,
      scene: backgroundScene,
    });

    return {
      character_id: character.identity.id,
      scene_id: `sprite_${pose.id}`,
      outfit_id: activeOutfit.name,
      prompt: generateFlatPrompt({
        character,
        pose,
        outfit: activeOutfit,
        scene: backgroundScene,
      }),
      negative_prompt: generateNegativePrompt(character),
      settings: {
        aspect_ratio: character.visual.generation.meta.aspect_ratio,
        quality: character.visual.generation.meta.quality,
        resolution: character.visual.generation.meta.resolution,
      },
    };
  });
}

// ============================================================================
// CONTENT GENERATION PROMPTS
// ============================================================================

export type ContentMood = 'happy' | 'pensive' | 'excited' | 'calm' | 'mysterious';

/**
 * Generate a prompt for daily content (social media posts, etc.)
 */
export function generateContentPrompt(
  character: CosmicCharacter,
  mood: ContentMood,
  contentType: 'selfie' | 'candid' | 'aesthetic' | 'story'
): GenerationPrompt {
  const moodToExpression: Record<ContentMood, string> = {
    happy: 'genuine warm smile, eyes crinkled with joy',
    pensive: 'thoughtful distant gaze, contemplative',
    excited: 'bright eyes, animated expression, energy visible',
    calm: 'serene peaceful expression, soft content smile',
    mysterious: 'enigmatic slight smile, knowing eyes',
  };

  const contentTypeToScene: Record<string, Partial<SceneTemplate>> = {
    selfie: {
      camera_perspective: {
        pov: 'selfie angle',
        angle: 'slightly above eye level',
        framing: 'closeup to portrait',
        distance: 'arm length',
        motion: 'candid moment',
      },
    },
    candid: {
      camera_perspective: {
        pov: 'friend taking photo',
        angle: 'natural eye level',
        framing: 'half_body to full_body',
        distance: '2-3 meters',
        motion: 'caught naturally',
      },
    },
    aesthetic: {
      camera_perspective: {
        pov: 'artistic composition',
        angle: 'creative angle',
        framing: 'dramatic framing',
        distance: 'varies for composition',
        motion: 'perfectly still moment',
      },
    },
    story: {
      camera_perspective: {
        pov: 'narrative perspective',
        angle: 'cinematic',
        framing: 'wide establishing',
        distance: 'environmental',
        motion: 'story beat frozen',
      },
    },
  };

  // Pick a random appropriate scene
  const sceneCategories = contentType === 'aesthetic'
    ? ['aesthetic', 'emotional']
    : ['everyday', 'aesthetic'];

  const appropriateScenes = character.visual.scene_templates.filter(
    (s) => sceneCategories.includes(s.category)
  );
  const baseScene = appropriateScenes[Math.floor(Math.random() * appropriateScenes.length)]
    || character.visual.scene_templates[0];

  return {
    character_id: character.identity.id,
    scene_id: `content_${contentType}_${mood}`,
    prompt: generateFlatPrompt({
      character,
      scene: baseScene,
      customOverrides: {
        expression: moodToExpression[mood],
      },
    }),
    negative_prompt: generateNegativePrompt(character),
    settings: {
      aspect_ratio: contentType === 'story' ? '16:9' : '9:16',
      quality: character.visual.generation.meta.quality,
      resolution: character.visual.generation.meta.resolution,
    },
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDefaultScene(character: CosmicCharacter): SceneTemplate {
  return character.visual.scene_templates[0] || {
    id: 'default',
    name: 'Default',
    category: 'everyday',
    scene: {
      location: 'neutral studio environment',
      environment: ['soft gradient background', 'professional lighting'],
      time: 'afternoon',
      atmosphere: 'calm and focused',
    },
    camera_perspective: {
      pov: 'professional portrait',
      angle: 'eye level',
      framing: 'portrait',
      distance: '2 meters',
      motion: 'still',
    },
    pose: {
      position: 'standing centered',
      body: 'relaxed natural stance',
      arms: 'natural at sides',
      expression: 'neutral engaging',
      interaction: 'looking at camera',
    },
    outfit_category: 'casual',
    vibe: 'approachable and present',
  };
}

function getOutfitForScene(
  character: CosmicCharacter,
  scene: SceneTemplate
): OutfitTemplate | undefined {
  const wardrobeCategory = scene.outfit_category || 'casual';
  const outfits = character.visual.style.wardrobe[wardrobeCategory];
  return outfits?.[0];
}

function getNeutralBackgroundScene(): SceneTemplate {
  return {
    id: 'neutral_bg',
    name: 'Neutral Background',
    category: 'special',
    scene: {
      location: 'professional studio',
      environment: [
        'soft gray gradient background',
        'even professional lighting',
        'clean minimal space',
      ],
      time: 'afternoon',
      atmosphere: 'neutral, focused on subject',
    },
    camera_perspective: {
      pov: 'reference photo angle',
      angle: 'varies per pose',
      framing: 'varies per pose',
      distance: '2 meters',
      motion: 'completely still',
    },
    pose: {
      position: 'centered in frame',
      body: 'clear view of full pose',
      arms: 'visible and defined',
      expression: 'neutral reference expression',
      interaction: 'none - pure reference',
    },
    outfit_category: 'casual',
    vibe: 'clean reference image',
  };
}

function getTransparentBackgroundScene(): SceneTemplate {
  return {
    id: 'transparent_bg',
    name: 'Transparent Background',
    category: 'special',
    scene: {
      location: 'isolated on transparent background',
      environment: [
        'pure transparent/alpha background',
        'subject fully isolated',
        'even lighting for cutout',
      ],
      time: 'afternoon',
      atmosphere: 'clean isolated subject',
    },
    camera_perspective: {
      pov: 'asset generation angle',
      angle: 'varies per pose',
      framing: 'varies per pose',
      distance: '2 meters',
      motion: 'completely still',
    },
    pose: {
      position: 'centered, full body visible',
      body: 'no cropping, complete figure',
      arms: 'not crossing body edges',
      expression: 'clear and defined',
      interaction: 'none',
    },
    outfit_category: 'casual',
    vibe: 'clean asset for compositing',
  };
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

export interface BatchGenerationConfig {
  character: CosmicCharacter;
  count: number;
  variety: 'scenes' | 'outfits' | 'moods' | 'all';
}

/**
 * Generate multiple varied prompts for batch content creation
 */
export function generateBatchPrompts(config: BatchGenerationConfig): GenerationPrompt[] {
  const { character, count, variety } = config;
  const prompts: GenerationPrompt[] = [];

  const scenes = character.visual.scene_templates;
  const outfits = [
    ...character.visual.style.wardrobe.casual,
    ...character.visual.style.wardrobe.going_out,
  ];
  const moods: ContentMood[] = ['happy', 'pensive', 'excited', 'calm', 'mysterious'];

  for (let i = 0; i < count; i++) {
    let scene: SceneTemplate;
    let outfit: OutfitTemplate;
    let mood: ContentMood;

    switch (variety) {
      case 'scenes':
        scene = scenes[i % scenes.length];
        outfit = outfits[0];
        mood = 'calm';
        break;
      case 'outfits':
        scene = scenes[0];
        outfit = outfits[i % outfits.length];
        mood = 'calm';
        break;
      case 'moods':
        scene = scenes[0];
        outfit = outfits[0];
        mood = moods[i % moods.length];
        break;
      case 'all':
      default:
        scene = scenes[i % scenes.length];
        outfit = outfits[i % outfits.length];
        mood = moods[i % moods.length];
    }

    prompts.push({
      character_id: character.identity.id,
      scene_id: `batch_${i}_${scene.id}`,
      outfit_id: outfit.name,
      prompt: generateFlatPrompt({
        character,
        scene,
        outfit,
        customOverrides: {
          expression: getMoodExpression(mood),
        },
      }),
      negative_prompt: generateNegativePrompt(character),
      settings: {
        aspect_ratio: character.visual.generation.meta.aspect_ratio,
        quality: character.visual.generation.meta.quality,
        resolution: character.visual.generation.meta.resolution,
      },
    });
  }

  return prompts;
}

function getMoodExpression(mood: ContentMood): string {
  const expressions: Record<ContentMood, string> = {
    happy: 'warm genuine smile, joyful eyes',
    pensive: 'thoughtful gaze, contemplative expression',
    excited: 'bright animated expression, energetic',
    calm: 'serene peaceful, soft content smile',
    mysterious: 'enigmatic slight smile, knowing look',
  };
  return expressions[mood];
}

// ============================================================================
// EXPORT FORMATS
// ============================================================================

/**
 * Export prompt in format suitable for different AI image generators
 */
export function exportForPlatform(
  prompt: GenerationPrompt,
  platform: 'midjourney' | 'dalle' | 'stable_diffusion' | 'nano_banana'
): string {
  switch (platform) {
    case 'midjourney':
      return `${prompt.prompt} --ar ${prompt.settings.aspect_ratio.replace(':', ':')} --q 2 --s 750`;

    case 'dalle':
      return prompt.prompt;

    case 'stable_diffusion':
      return JSON.stringify({
        prompt: prompt.prompt,
        negative_prompt: prompt.negative_prompt,
        width: prompt.settings.aspect_ratio === '9:16' ? 768 : 1024,
        height: prompt.settings.aspect_ratio === '9:16' ? 1344 : 1024,
        steps: 30,
        cfg_scale: 7.5,
      });

    case 'nano_banana':
      return JSON.stringify({
        prompt: prompt.prompt,
        negative_prompt: prompt.negative_prompt,
        aspect_ratio: prompt.settings.aspect_ratio,
        quality: prompt.settings.quality,
      });

    default:
      return prompt.prompt;
  }
}
