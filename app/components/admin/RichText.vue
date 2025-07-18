<template>
  <div class="wysiwyg-editor">
    <!-- Toolbar -->
    <div class="toolbar border-b border-gray-200 p-2 flex items-center gap-1 bg-gray-50 rounded-t-lg">
      <!-- Formatting buttons -->
      <div class="flex items-center gap-1">
        <UButton
          :variant="isActive('bold') ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          square
          :title="`Bold (Ctrl+B)`"
          @click="execCommand('bold')"
        >
          <Icon name="heroicons:bold" class="w-4 h-4" />
        </UButton>
        
        <UButton
          :variant="isActive('italic') ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          square
          :title="`Italic (Ctrl+I)`"
          @click="execCommand('italic')"
        >
          <Icon name="heroicons:italic" class="w-4 h-4" />
        </UButton>
        
        <UButton
          :variant="isActive('underline') ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          square
          :title="`Underline (Ctrl+U)`"
          @click="execCommand('underline')"
        >
          <Icon name="heroicons:underline" class="w-4 h-4" />
        </UButton>
      </div>
      
      <div class="w-px h-5 bg-gray-300 mx-1"/>
      
      <!-- Alignment buttons -->
      <div class="flex items-center gap-1">
        <UButton
          :variant="isActive('justifyLeft') ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          square
          title="Align Left"
          @click="execCommand('justifyLeft')"
        >
          <Icon name="heroicons:bars-3-bottom-left" class="w-4 h-4" />
        </UButton>
        
        <UButton
          :variant="isActive('justifyCenter') ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          square
          title="Center"
          @click="execCommand('justifyCenter')"
        >
          <Icon name="heroicons:bars-3" class="w-4 h-4" />
        </UButton>
        
        <UButton
          :variant="isActive('justifyRight') ? 'solid' : 'soft'"
          color="primary"
          size="xs"
          square
          title="Align Right"
          @click="execCommand('justifyRight')"
        >
          <Icon name="heroicons:bars-3-bottom-right" class="w-4 h-4" />
        </UButton>
      </div>
    </div>
    
    <!-- Editor Content -->
    <div
      ref="editor"
      :contenteditable="!disabled"
      class="p-4 border border-gray-200 focus:outline-none focus:border-primary-500 bg-white rounded-b-lg"
      :class="{
        'bg-gray-100 cursor-not-allowed': disabled,
        'min-h-32': !minHeight,
        [`min-h-${minHeight}`]: minHeight
      }"
      :style="{ minHeight: customMinHeight }"
      @input="handleInput"
      @keydown="handleKeydown"
      @paste="handlePaste"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
const {
  disabled = false,
  placeholder = 'Start typing...',
  minHeight = '',
  customMinHeight = '128px'
} = defineProps<{
  disabled?: boolean
  placeholder?: string
  minHeight?: string
  customMinHeight?: string
}>()

const emit = defineEmits<{
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const model = defineModel<string>({ default: '' })

const editor = ref<HTMLDivElement | null>(null)
const content = ref(model.value)
const isFocused = ref(false)
const isUpdatingFromProp = ref(false)

// Save and restore cursor position
const saveCursorPosition = (): Range | null => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    return selection.getRangeAt(0)
  }
  return null
}

const restoreCursorPosition = (range: Range | null): void => {
  if (range) {
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
}

watch(model, (newValue) => {
  if (newValue !== content.value && !isUpdatingFromProp.value) {
    const cursorPosition = saveCursorPosition()
    content.value = newValue
    if (editor.value) {
      editor.value.innerHTML = newValue || ''
      nextTick(() => {
        if (isFocused.value) {
          restoreCursorPosition(cursorPosition)
        }
      })
    }
  }
})

const execCommand = (command: string, value: string | null = null): void => {
  if (disabled) return
  
  try {
    const cursorPosition = saveCursorPosition()
    document.execCommand(command, false, value || undefined)
    editor.value?.focus()
    // Small delay to ensure command is executed before restoring cursor
    nextTick(() => {
      if (command !== 'bold' && command !== 'italic' && command !== 'underline') {
        restoreCursorPosition(cursorPosition)
      }
    })
    handleInput()
  } catch {
    console.warn('Command not supported:', command)
  }
}

const isActive = (command: string): boolean => {
  try {
    return document.queryCommandState(command)
  } catch {
    return false
  }
}

const handleInput = (): void => {
  if (editor.value && !isUpdatingFromProp.value) {
    isUpdatingFromProp.value = true
    const newContent = editor.value.innerHTML
    content.value = newContent
    model.value = newContent
    nextTick(() => {
      isUpdatingFromProp.value = false
    })
  }
}

const handleFocus = (event: FocusEvent): void => {
  isFocused.value = true
  if (editor.value && editor.value.innerHTML === getPlaceholderHTML()) {
    editor.value.innerHTML = ''
  }
  emit('focus', event)
}

const handleBlur = (event: FocusEvent): void => {
  isFocused.value = false
  if (editor.value && (editor.value.textContent?.trim() === '' || !editor.value.textContent)) {
    editor.value.innerHTML = getPlaceholderHTML()
  }
  emit('blur', event)
}

const getPlaceholderHTML = () => {
  return `<p style="color: #9ca3af; font-style: italic;">${placeholder}</p>`
}

const handleKeydown = (event: KeyboardEvent): void => {
  // Handle tab key
  if (event.key === 'Tab') {
    event.preventDefault()
    execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;')
  }
  
  // Handle keyboard shortcuts
  if (event.ctrlKey || event.metaKey) {
    switch (event.key.toLowerCase()) {
      case 'b':
        event.preventDefault()
        execCommand('bold')
        break
      case 'i':
        event.preventDefault()
        execCommand('italic')
        break
      case 'u':
        event.preventDefault()
        execCommand('underline')
        break
    }
  }
}

const handlePaste = (event: ClipboardEvent): void => {
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') || ''
  execCommand('insertText', text)
}

onMounted(() => {
  if (editor.value) {
    if (model.value) {
      editor.value.innerHTML = model.value
    } else {
      editor.value.innerHTML = getPlaceholderHTML()
    }
  }
})
</script>