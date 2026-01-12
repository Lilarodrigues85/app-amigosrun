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