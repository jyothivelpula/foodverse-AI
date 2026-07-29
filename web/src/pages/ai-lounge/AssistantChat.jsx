import { Navigate, useParams } from 'react-router-dom'
import { getAssistant } from '../../data/aiLounge'
import ChatPage from '../../components/ai-lounge/ChatPage'

export default function AssistantChat() {
  const { category: categoryId, assistant: assistantId } = useParams()
  const result = getAssistant(categoryId, assistantId)

  if (!result) {
    return <Navigate to="/ai-lounge" replace />
  }

  return <ChatPage category={result.category} assistant={result.assistant} />
}
