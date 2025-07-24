<template>
  <div class="space-y-4">
    <ImageUpload
      v-model="model.imageUrl"
      storage-path="blog"
      :disabled
      :alt="model.alt"
      auto-upload
    />

    <!-- SEO Fields -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField :label="$t('admin.blog.imageAlt')" :hint="$t('admin.blog.imageAltHint')">
        <UInput 
          v-model="model.alt"
          :placeholder="'Enter alt text for accessibility...'"
          :disabled
          class="w-full"
        />
      </UFormField>

      <UFormField :label="$t('admin.blog.imageTitle')" :hint="$t('admin.blog.imageTitleHint')">
        <UInput 
          v-model="model.title"
          :placeholder="'Enter image title...'"
          :disabled
          class="w-full"
        />
      </UFormField>
    </div>

    <UFormField :label="$t('admin.blog.imageCaption')" :hint="$t('admin.blog.imageCaptionHint')">
      <UTextarea 
        v-model="model.caption"
        :placeholder="'Enter optional caption...'"
        :disabled
        :rows="2"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script setup lang="ts">


interface Props {
  modelValue: {
    imageUrl: string
    alt: string
    title: string
    caption: string
  }
  disabled?: boolean
}

const { disabled } = defineProps<Props>()

const model = defineModel<{
  imageUrl: string
  alt: string
  title: string
  caption: string
}>('modelValue', { required: true })
</script> 