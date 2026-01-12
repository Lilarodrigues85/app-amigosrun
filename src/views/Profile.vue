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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 0;
  }
}
</style>