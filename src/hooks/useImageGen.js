import { useState, useCallback } from 'react'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import { useAuth } from './useAuth'

// Mots déclencheurs — toutes les formulations possibles
const IMAGE_TRIGGERS = [
  // Français
  'génère une image', 'générer une image', 'crée une image', 'créer une image',
  'génère moi une image', 'crée moi une image', 'fais moi une image',
  'dessine', 'illustre', 'visualise', 'montre moi une image',
  'génère une photo', 'crée une photo', 'fais une image', 'fais une photo',
  'image de', 'photo de', 'illustration de', 'génère', 'imagine',
  'produis une image', 'genère', 'générer',
  // Anglais
  'generate an image', 'create an image', 'make an image', 'draw',
  'generate image', 'create image', 'make image', 'show me an image',
  'generate a photo', 'create a photo', 'image of', 'photo of',
]

export function detectImageRequest(text) {
  const lower = text.toLowerCase().trim()
  return IMAGE_TRIGGERS.some(trigger => lower.includes(trigger))
}

// Extraire le sujet de l'image depuis le message
export function extractImagePrompt(text) {
  const lower = text.toLowerCase()
  // Patterns pour extraire le sujet après le déclencheur
  const patterns = [
    /(?:génère|créé?|fais|dessine|illustre|visualise|produis|imagine|generate|create|make|draw)\s+(?:moi\s+)?(?:une?\s+)?(?:image|photo|illustration|dessin)?\s*(?:de\s+|d['']\s*|of\s+|sur\s+|about\s+)?(.+)/i,
    /(?:image|photo|illustration)\s+(?:de\s+|d['']\s*|of\s+)?(.+)/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]?.trim()) {
      return match[1].trim()
    }
  }
  // Fallback : utiliser le message entier
  return text.trim()
}

export function useImageGen(conversationId, onMessageAdded, onTitleUpdate) {
  const { session } = useAuth()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  const generateImage = useCallback(async (userText) => {
    if (!session || !conversationId) return false
    setGenerating(true)
    setError(null)

    const imagePrompt = extractImagePrompt(userText)

    // Ajouter message utilisateur immédiatement (optimiste)
    const tempUserId = 'temp-img-user-' + Date.now()
    const tempAssistantId = 'temp-img-assistant-' + Date.now()

    onMessageAdded?.([
      {
        id: tempUserId,
        role: 'user',
        content: userText,
        created_at: new Date().toISOString(),
        temp: true,
      },
      {
        id: tempAssistantId,
        role: 'assistant',
        content: '__GENERATING_IMAGE__',
        created_at: new Date().toISOString(),
        temp: true,
        isGeneratingImage: true,
      },
    ])

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/image-gen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          conversation_id: conversationId,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur génération')
      }

      // Remplacer les messages temp par les vrais
      onMessageAdded?.([
        {
          id: data.user_message_id || tempUserId,
          role: 'user',
          content: userText,
          created_at: new Date().toISOString(),
        },
        {
          id: data.assistant_message_id || tempAssistantId,
          role: 'assistant',
          content: `[IMAGE_GENERATED]${data.image_url}[/IMAGE_GENERATED]\n\nVoici l'image générée pour : **${imagePrompt}**`,
          created_at: new Date().toISOString(),
          isImage: true,
          imageUrl: data.image_url,
          imagePrompt: imagePrompt,
        },
      ], { replaceTempIds: [tempUserId, tempAssistantId] })

      // Titre auto
      onTitleUpdate?.(conversationId, `Image : ${imagePrompt.slice(0, 48)}`)

      return true
    } catch (err) {
      setError(err.message)
      // Retirer les messages temp en cas d'erreur
      onMessageAdded?.(null, { removeTempIds: [tempUserId, tempAssistantId] })
      return false
    } finally {
      setGenerating(false)
    }
  }, [session, conversationId, onMessageAdded, onTitleUpdate])

  return { generating, error, generateImage }
}
