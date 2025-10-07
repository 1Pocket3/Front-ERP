<template>
  <v-card variant="outlined" class="pa-4">
    <h3 class="text-h6 mb-4">{{ t('comments') }}</h3>
    
    <!-- Форма добавления комментария -->
    <v-form @submit.prevent="addComment" class="mb-4">
      <v-textarea
        v-model="newCommentText"
        :placeholder="t('add_comment_placeholder')"
        variant="outlined"
        rows="3"
        hide-details
        class="mb-2"
        :disabled="isSubmitting"
      />
      <div class="d-flex justify-end">
        <v-btn
          type="submit"
          color="primary"
          :loading="isSubmitting"
          :disabled="!newCommentText.trim()"
        >
          {{ t('add_comment') }}
        </v-btn>
      </div>
    </v-form>

    <!-- Список комментариев -->
    <div v-if="isLoading" class="text-center py-4">
      <v-progress-circular indeterminate color="primary" />
    </div>
    
    <div v-else-if="comments.length === 0" class="text-center py-4 text-grey">
      {{ t('no_comments') }}
    </div>
    
    <div v-else class="comments-list">
      <v-card
        v-for="comment in comments"
        :key="comment.id"
        variant="outlined"
        class="mb-3 pa-3 comment-card"
      >
        <div class="d-flex justify-space-between align-start">
          <div class="flex-grow-1">
            <div class="d-flex align-center mb-2">
              <v-avatar size="32" color="primary" class="mr-3">
                <span class="text-white text-caption">
                  {{ getInitials(comment.author_name) }}
                </span>
              </v-avatar>
              <div>
                <div class="font-weight-medium">
                  {{ comment.author_name }}
                  <v-chip 
                    v-if="!isCommentAuthor(comment) && canEditComment(comment)" 
                    size="x-small" 
                    color="error" 
                    class="ml-2"
                  >
                    {{ t('editing_as_admin') }}
                  </v-chip>
                </div>
                <div class="text-caption text-grey">
                  {{ formatDate(comment.created_at) }}
                </div>
              </div>
            </div>
            <div class="comment-text">{{ comment.text }}</div>
          </div>
          
          <!-- Кнопки действий (для автора или админа) -->
          <div v-if="canEditComment(comment)" class="ml-2 comment-actions">
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn
                  icon="mdi-dots-vertical"
                  size="small"
                  variant="text"
                  v-bind="props"
                />
              </template>
              <v-list>
                <v-list-item @click="editComment(comment)">
                  <template v-slot:prepend>
                    <v-icon>mdi-pencil</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ isCommentAuthor(comment) ? t('edit') : t('edit_as_admin') }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteComment(comment.id)" class="text-error">
                  <template v-slot:prepend>
                    <v-icon color="error">mdi-delete</v-icon>
                  </template>
                  <v-list-item-title>
                    {{ isCommentAuthor(comment) ? t('delete') : t('delete_as_admin') }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-card>
    </div>

    <!-- Диалог редактирования комментария -->
    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ editingCommentId && comments.find((c: Comment) => c.id === editingCommentId) && !isCommentAuthor(comments.find((c: Comment) => c.id === editingCommentId)!) 
             ? t('edit_comment_as_admin') 
             : t('edit_comment') }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="editingCommentText"
            :placeholder="t('edit_comment_placeholder')"
            variant="outlined"
            rows="3"
            hide-details
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="editDialog = false">{{ t('cancel') }}</v-btn>
          <v-btn
            color="primary"
            @click="saveEditedComment"
            :loading="isSubmitting"
            :disabled="!editingCommentText.trim()"
          >
            {{ t('save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLeadsStore } from '@/stores/leads/leads'
import { useAuthStore } from '@/stores/auth/auth'
import type { Comment } from '@/stores/leads/leads'

const { t } = useI18n()
const store = useLeadsStore()
const authStore = useAuthStore()

interface Props {
  leadId: number
}

const props = defineProps<Props>()

// Реактивные данные
const comments = ref<Comment[]>([])
const newCommentText = ref('')
const editingCommentText = ref('')
const editingCommentId = ref<number | null>(null)
const editDialog = ref(false)
const isLoading = ref(false)
const isSubmitting = ref(false)

// Получаем текущего пользователя
const currentUser = computed(() => authStore.getCurrentUser)

// Загружаем комментарии
const fetchComments = async () => {
  isLoading.value = true
  try {
    comments.value = await store.getLeadComments(props.leadId)
  } catch (error) {
    console.error('Error fetching comments:', error)
  } finally {
    isLoading.value = false
  }
}

// Добавляем новый комментарий
const addComment = async () => {
  if (!newCommentText.value.trim()) return
  
  isSubmitting.value = true
  try {
    const newComment = await store.createComment(props.leadId, newCommentText.value)
    comments.value.unshift(newComment)
    newCommentText.value = ''
  } catch (error) {
    console.error('Error creating comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Редактируем комментарий
const editComment = (comment: Comment) => {
  editingCommentId.value = comment.id
  editingCommentText.value = comment.text
  editDialog.value = true
}

// Сохраняем отредактированный комментарий
const saveEditedComment = async () => {
  if (!editingCommentId.value || !editingCommentText.value.trim()) return
  
  isSubmitting.value = true
  try {
    const updatedComment = await store.updateComment(editingCommentId.value, editingCommentText.value)
    const index = comments.value.findIndex(c => c.id === editingCommentId.value)
    if (index !== -1) {
      comments.value[index] = updatedComment
    }
    editDialog.value = false
    editingCommentId.value = null
    editingCommentText.value = ''
  } catch (error) {
    console.error('Error updating comment:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Удаляем комментарий
const deleteComment = async (commentId: number) => {
  const comment = comments.value.find(c => c.id === commentId)
  const isOwnComment = comment && isCommentAuthor(comment)
  
  const confirmMessage = isOwnComment 
    ? t('confirm_delete_comment')
    : t('confirm_delete_comment_as_admin')
  
  if (!confirm(confirmMessage)) return
  
  try {
    await store.deleteComment(commentId)
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (error) {
    console.error('Error deleting comment:', error)
  }
}

// Проверяем, является ли пользователь автором комментария
const isCommentAuthor = (comment: Comment) => {
  return currentUser.value && comment.author.id === currentUser.value.id
}

// Проверяем, может ли пользователь редактировать/удалять комментарий
const canEditComment = (comment: Comment) => {
  if (!currentUser.value) return false
  // Админ может редактировать любые комментарии, менеджер - только свои
  return currentUser.value.role === 'admin' || isCommentAuthor(comment)
}

// Получаем инициалы для аватара
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Форматируем дату
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Загружаем комментарии при монтировании компонента
onMounted(() => {
  fetchComments()
})

// Экспортируем функцию для обновления комментариев извне
defineExpose({
  fetchComments
})
</script>

<style scoped>
.comments-list {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: visible;
}

.comment-text {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Убираем overflow: hidden с карточек комментариев */
.comment-card {
  overflow: visible !important;
}

/* Стили для контейнера кнопок действий */
.comment-actions {
  position: relative;
}
</style>
