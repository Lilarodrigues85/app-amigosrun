<template>
  <div class="profile-page">
    <div class="container">
      <ProfileForm />
    </div>
  </div>
</template>

<script setup>
import ProfileForm from '@/components/profile/ProfileForm.vue'
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 2rem 0;
  padding-top: calc(2rem + env(safe-area-inset-top));
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 0;
    padding-top: calc(1rem + env(safe-area-inset-top));
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    align-items: flex-start;
  }
  
  .container {
    padding: 0 0.75rem;
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 0.75rem 0;
    padding-top: calc(0.75rem + env(safe-area-inset-top));
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  }
  
  .container {
    padding: 0 0.5rem;
  }
}

/* Orientação landscape */
@media (max-height: 500px) and (orientation: landscape) {
  .profile-page {
    padding: 0.5rem 0;
    align-items: flex-start;
  }
}
</style>