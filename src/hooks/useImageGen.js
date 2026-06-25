import { useState, useCallback, useRef } from 'react'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import { useAuth } from './useAuth'

const IMAGE_TRIGGERS = [
  'génère une image', 'générer une image', 'crée une image', 'créer une image',
  'génère moi une image', 'crée moi une image', 'fais moi une image',
  'dessine', 'illustre', 'visualise', 'montre moi une image',
  'génère une photo', 'crée une photo', 'fais une image', 'fais une photo',
  'image de', 'photo de', 'illustration de', 'produis une image',
  'generate an image', 'create an image', 'make an image', 'draw',
  'generate image', 'create image', 'make image', 'show me an image',
  'generate a photo', 'create a photo', 'image of', 'photo of',
]

export function detectImageRequest(text) {
  const lower = text.toLowerCase().trim()
  return IMAGE_TRIGGERS.some(trigger => lower.includes(trigger))
}

export function extractImagePrompt(text) {
  const patterns = [
    /(?:génère|créé?|fais|dessine|illustre|visualise|produis|imagine|generate|create|make|draw)\s+(?:moi\s+)?(?:une?\s+)?(?:image|photo|illustration|dessin)?\s*(?:de\s+|d['']\s*|of\s+|sur\s+|about\s+)?(.+)/i,
    /(?:image|photo|illustration)\s+(?:de\s+|d['']\s*|of\s+)?(.+)/i,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]?.trim()) return match[1].trim()
  }
  return text.trim()
}

export function useImageGen(conversationId, setMessages, onTitleUpdate) {
  const { session } = useAuth()
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  // Garder les IDs temp en ref pour les retrouver même après re-render
  const tempIdsRef = useRef({ userId: null, assistantId: null })

  const generateImage = useCallback(async (userText) => {
    if (!session || !conversationId) return false
    setGenerating(true)
    setError(null)

    const imagePrompt = extractImagePrompt(userText)
    const tempUserId = 'temp-img-user-' + Date.now()
    const tempAssistantId = 'temp-img-assistant-' + Date.now()
    tempIdsRef.current = { userId: tempUserId, assistantId: tempAssistantId }

    // Ajouter les 2 messages temp directement via setMessages
    setMessages(prev => [
      ...prev,
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
        throw new Error(data.error || 'Erreur génération image')
      }

      // Remplacer les messages temp par les vrais — via setMessages fonctionnel
      setMessages(prev => {
        // Retirer les 2 messages temp
        const filtered = prev.filter(m =>
          m.id !== tempUserId && m.id !== tempAssistantId
        )
        // Ajouter les vrais messages
        return [
          ...filtered,
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
        ]
      })

      onTitleUpdate?.(conversationId, `Image : ${imagePrompt.slice(0, 48)}`)
      return true

    } catch (err) {
      setError(err.message)
      // Retirer les messages temp en cas d'erreur
      setMessages(prev => prev.filter(m =>
        m.id !== tempUserId && m.id !== tempAssistantId
      ))
      return false
    } finally {
      setGenerating(false)
    }
  }, [session, conversationId, setMessages, onTitleUpdate])

  return { generating, error, generateImage }
}
