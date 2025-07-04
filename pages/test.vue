<template>
  <div class="test-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"/>
      <p>Loading test questions...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <h2>Error Loading Test</h2>
      <p>{{ error }}</p>
      <button class="retry-button" @click="fetchTestData">Retry</button>
    </div>

    <!-- Test Complete -->
    <div v-else-if="testComplete" class="results-container">
      <div class="results-card">
        <h1>🎉 Test Complete!</h1>
        <div class="score-display">
          <div class="score-circle">
            <span class="score-number">{{ score }}</span>
            <span class="score-total">/ {{ totalQuestions }}</span>
          </div>
          <p class="score-percentage">{{ Math.round((score / totalQuestions) * 100) }}%</p>
        </div>
        
        <div class="score-breakdown">
          <h3>Results by Question Type:</h3>
          <div class="breakdown-grid">
            <div v-for="(result, type) in scoreByType" :key="type" class="breakdown-item">
              <span class="type-label">Type {{ type }}</span>
              <span class="type-score">{{ result.correct }}/{{ result.total }}</span>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <NuxtLink to="/" class="home-button">Back to Home</NuxtLink>
          <button class="restart-button" @click="restartTest">Restart Test</button>
        </div>
      </div>
    </div>

    <!-- Test Interface -->
    <div v-else class="test-interface">
      <!-- Progress Bar -->
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"/>
        </div>
        <p class="progress-text">
          Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
        </p>
      </div>

      <!-- Current Question -->
      <div v-if="currentQuestion" class="question-container">
        <div class="question-header">
          <h2 v-if="currentTest.title" class="test-title">{{ currentTest.title }}</h2>
          <h3 v-if="currentTest.subtitle" class="test-subtitle">{{ currentTest.subtitle }}</h3>
        </div>

        <!-- Test Content -->
        <div class="test-content">
          <!-- Image (Type 1) -->
          <div v-if="currentTest.imageUrl && currentTest.type === 1" class="image-container">
            <img :src="currentTest.imageUrl" :alt="currentTest.title" class="test-image" >
          </div>

          <!-- Text Content (Types 2, 3, 4, 5) -->
          <div v-if="currentTest.text" class="text-content">
            <p v-html="formatText(currentTest.text)"/>
          </div>

          <!-- Question -->
          <div class="question-section">
            <h4 class="question-text">{{ currentQuestion.text }}</h4>
            
            <!-- Answer Options -->
            <div class="options-container">
              <label 
                v-for="(option, index) in currentQuestion.options" 
                :key="index"
                class="option-label"
                :class="{ 'selected': userAnswers[currentQuestion.questionId] === index }"
              >
                <input
                  v-model="userAnswers[currentQuestion.questionId]"
                  type="radio"
                  :name="currentQuestion.questionId"
                  :value="index"
                  class="option-input"
                >
                <span class="option-text">{{ option }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="navigation">
          <button 
            :disabled="currentQuestionIndex === 0" 
            class="nav-button prev-button"
            @click="previousQuestion"
          >
            ← Previous
          </button>
          
          <button 
            :disabled="!isCurrentQuestionAnswered"
            class="nav-button next-button"
            @click="nextQuestion"
          >
            {{ isLastQuestion ? 'Finish Test' : 'Next →' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page metadata
useHead({
  title: 'English Proficiency Test'
})

// Reactive state
const loading = ref(true)
const error = ref(null)
const testData = ref([])
const currentQuestionIndex = ref(0)
const userAnswers = ref({})
const testComplete = ref(false)

// Computed properties
const allQuestions = computed(() => {
  const questions = []
  testData.value.forEach(test => {
    test.questions.forEach(question => {
      questions.push({
        ...question,
        testId: test.id,
        testType: test.type,
        test: test
      })
    })
  })
  return questions
})

const totalQuestions = computed(() => allQuestions.value.length)

const currentQuestion = computed(() => {
  return allQuestions.value[currentQuestionIndex.value]
})

const currentTest = computed(() => {
  return currentQuestion.value?.test || {}
})

const progressPercentage = computed(() => {
  return totalQuestions.value > 0 ? (currentQuestionIndex.value / totalQuestions.value) * 100 : 0
})

const isCurrentQuestionAnswered = computed(() => {
  return currentQuestion.value && userAnswers.value[currentQuestion.value.questionId] !== undefined
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1
})

const score = computed(() => {
  let correct = 0
  allQuestions.value.forEach(question => {
    if (userAnswers.value[question.questionId] === question.correctAnswerIndex) {
      correct++
    }
  })
  return correct
})

const scoreByType = computed(() => {
  const breakdown = {}
  allQuestions.value.forEach(question => {
    const type = question.testType
    if (!breakdown[type]) {
      breakdown[type] = { correct: 0, total: 0 }
    }
    breakdown[type].total++
    if (userAnswers.value[question.questionId] === question.correctAnswerIndex) {
      breakdown[type].correct++
    }
  })
  return breakdown
})

// Methods
async function fetchTestData() {
  try {
    loading.value = true
    error.value = null
    const response = await $fetch('/api/english-test')
    testData.value = response
  } catch (err) {
    console.error('Error fetching test data:', err)
    error.value = 'Failed to load test data. Please try again.'
  } finally {
    loading.value = false
  }
}

function formatText(text) {
  // Replace [[number]] with highlighted blanks for cloze tests
  return text.replace(/\[\[(\d+)\]\]/g, '<span class="blank">[$1]</span>')
}

function nextQuestion() {
  if (isLastQuestion.value) {
    testComplete.value = true
  } else {
    currentQuestionIndex.value++
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

function restartTest() {
  currentQuestionIndex.value = 0
  userAnswers.value = {}
  testComplete.value = false
}

// Lifecycle
onMounted(() => {
  fetchTestData()
})
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 1rem;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.results-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.results-card {
  background: white;
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.score-display {
  margin: 2rem 0;
}

.score-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 8px solid #4f46e5;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.score-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4f46e5;
}

.score-total {
  font-size: 1.2rem;
  color: #64748b;
}

.score-percentage {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.breakdown-item {
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.type-label {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.type-score {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.home-button, .restart-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.home-button {
  background: #64748b;
  color: white;
}

.restart-button {
  background: #4f46e5;
  color: white;
  border: none;
  cursor: pointer;
}

.test-interface {
  max-width: 800px;
  margin: 0 auto;
}

.progress-container {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: #4f46e5;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: #64748b;
  margin: 0;
}

.question-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.question-header {
  margin-bottom: 1.5rem;
}

.test-title {
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.test-subtitle {
  color: #64748b;
  margin: 0;
  font-weight: normal;
}

.image-container {
  text-align: center;
  margin: 1.5rem 0;
}

.test-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.text-content {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  line-height: 1.6;
}

.text-content :deep(.blank) {
  background: #fef3c7;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-weight: 600;
  color: #92400e;
}

.question-section {
  margin: 2rem 0;
}

.question-text {
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-label {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-label:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.option-label.selected {
  background: #eff6ff;
  border-color: #4f46e5;
}

.option-input {
  margin-right: 0.75rem;
}

.option-text {
  flex: 1;
  color: #1e293b;
}

.navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.nav-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.prev-button {
  background: #64748b;
  color: white;
}

.prev-button:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.next-button {
  background: #4f46e5;
  color: white;
}

.next-button:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.nav-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .test-page {
    padding: 0.5rem;
  }
  
  .question-container {
    padding: 1rem;
  }
  
  .results-card {
    padding: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .navigation {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 