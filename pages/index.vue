<template>
  <div class="homepage">
    <div class="hero-section">
      <div class="container">
        <h1 class="title">English Proficiency Test</h1>
        <p class="subtitle">
          Test your English skills with our comprehensive assessment featuring reading comprehension, 
          grammar, and vocabulary exercises.
        </p>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">📖</div>
            <h3>Reading Comprehension</h3>
            <p>Test your understanding of written English texts</p>
          </div>
          <div class="feature">
            <div class="feature-icon">✏️</div>
            <h3>Grammar & Vocabulary</h3>
            <p>Assess your knowledge of English grammar rules</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🧩</div>
            <h3>Cloze Tests</h3>
            <p>Fill in the blanks to complete passages</p>
          </div>
        </div>

        <div class="cta-section">
          <NuxtLink to="/test" class="start-button">
            Start Test
          </NuxtLink>
          <p class="test-info">
            The test contains multiple question types and takes approximately 30-45 minutes to complete.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.homepage {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  color: white;
}

.title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.feature {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.feature p {
  opacity: 0.8;
  line-height: 1.5;
}

.cta-section {
  margin-top: 3rem;
}

.start-button {
  display: inline-block;
  background: #4f46e5;
  color: white;
  padding: 1rem 3rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.start-button:hover {
  background: #4338ca;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.test-info {
  margin-top: 1.5rem;
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 1rem;
  }
}
</style> 