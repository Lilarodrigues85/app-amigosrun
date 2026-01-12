<template>
  <div class="home">
    <div class="hero">
      <img src="@/assets/images/amigos_run_banner_text.png" alt="Amigos Run" class="hero-title" />
      <p class="hero-description">Conecte-se com corredores, descubra eventos e compartilhe experiências incríveis</p>
      <router-link to="/login" class="cta-button">
        🚀 Começar Agora
      </router-link>
    </div>
    
    <div class="features">
      <div class="feature">
        <div class="feature-icon">🏅</div>
        <h3>Descubra Corridas</h3>
        <p>Encontre eventos próximos a você</p>
      </div>
      <div class="feature">
        <div class="feature-icon">👥</div>
        <h3>Conecte-se</h3>
        <p>Conheça outros corredores</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📱</div>
        <h3>Compartilhe</h3>
        <p>Mostre suas conquistas</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home page
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('@/assets/images/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.hero {
  max-width: 600px;
  margin-bottom: 4rem;
}

.hero-title {
  max-width: 400px;
  height: auto;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.hero-description {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.cta-button {
  display: inline-block;
  padding: 16px 32px;
  background: rgba(255,255,255,0.2);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 800px;
  flex-wrap: wrap;
}

.feature {
  background: rgba(255,255,255,0.1);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
  max-width: 250px;
}

.feature:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.feature p {
  opacity: 0.9;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-title {
    max-width: 250px;
  }
  
  .features {
    flex-direction: column;
    align-items: center;
  }
  
  .feature {
    max-width: 100%;
  }
}
</style>