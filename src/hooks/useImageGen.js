import { useState, useCallback } from 'react'
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

  const generateImage = useCallback(async (userText) => {
    if (!session || !conversationId) return false
    setGenerating(true)

    const imagePrompt = extractImagePrompt(userText)
    const tempUserId = 'temp-img-user-' + Date.now()
    const tempAssistantId = 'temp-img-assistant-' + Date.now()

    // Ajouter les messages temp — ils RESTENT jusqu'à la fin
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

      let data
      try {
        data = await response.json()
      } catch {
        throw new Error('Réponse invalide du serveur')
      }

      if (!response.ok || !data.success) {
        // Remplacer le skeleton par un message d'erreur — ne pas supprimer
        setMessages(prev => prev.map(m => {
          if (m.id === tempAssistantId) {
            return {
              ...m,
              content: `❌ Génération impossible : ${data?.error || 'Erreur serveur'}. Vérifie que la clé FAL_API_KEY est bien configurée dans Supabase.`,
              isGeneratingImage: false,
              temp: false,
            }
          }
          if (m.id === tempUserId) return { ...m, temp: false }
          return m
        }))
        return false
      }

      // Succès — remplacer les temp par les vrais messages
      setMessages(prev => {
        const filtered = prev.filter(m =>
          m.id !== tempUserId && m.id !== tempAssistantId
        )
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
            imageUrl: data.image_url,
            imagePrompt: imagePrompt,
          },
        ]
      })

      onTitleUpdate?.(conversationId, `Image : ${imagePrompt.slice(0, 48)}`)
      return true

    } catch (err) {
      // En cas d'erreur réseau — afficher l'erreur dans le message assistant
      setMessages(prev => prev.map(m => {
        if (m.id === tempAssistantId) {
          return {
            ...m,
            content: `❌ Erreur de connexion : ${err.message}. Réessaie dans quelques secondes.`,
            isGeneratingImage: false,
            temp: false,
          }
        }
        if (m.id === tempUserId) return { ...m, temp: false }
        return m
      }))
      return false
    } finally {
      setGenerating(false)
    }
  }, [session, conversationId, setMessages, onTitleUpdate])

  return { generating, generateImage }
}
