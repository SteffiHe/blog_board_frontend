<script setup>
    import ArticleCard from './ArticleCard.vue';
    import { computed } from "vue";

    const props = defineProps({
        columns: {
            type: Array,
            required: true
        },
        columnId: {
            type: String,
            required: true
        }
    });

    defineEmits([
        'move-Article',
		'delete-article',
        'trigger-edit'
	])

    const column = computed(() => props.columns.find(c => c.id === props.columnId));

</script>

<template>
    <h4 class="text-light pt-4">{{ column.name }}</h4>
    <div class="column-body">
        <ArticleCard 
            v-for="article in column.articles"
            :key="article.id" 
            :article="article"
            :otherColumns="columns.filter(c => c.id !== columnId)" 
            @delete-article="(...args) => $emit('delete-article', ...args)"
            @move-article="(...args) => $emit('move-article', ...args)"
            @trigger-edit="(...args) => $emit('trigger-edit', ...args)"
        />
    </div>
</template>