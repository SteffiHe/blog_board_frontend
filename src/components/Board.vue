<script setup>
	import Column from './Column.vue';
	import { computed } from "vue";

	const { columns } = defineProps({
		columns: {
			type: Array,
			required: true
		}

	});

	defineEmits([
		'move-article',
		'delete-article',
		'trigger-edit'
	])

	// Compute dynamic column class
	const columnClass = computed(() => {
		const colSize = Math.floor(12 / (columns.length || 1)); // Avoid division by zero
		return `col-12 col-md-${colSize} col-lg-${colSize}`;
	});
</script>

<template>
	<div class="container">
		<div class="row">
            <div v-for="column in columns" :key="column.id" :class="columnClass">
				<Column
						:key="column.id"
						:columns="columns"
						:column-id="column.id"
						@delete-article="(...args) => $emit('delete-article', ...args)"
						@move-article="(...args) => $emit('move-article', ...args)"
						@trigger-edit="(...args) => $emit('trigger-edit', ...args)"
				/>
			</div>
		</div>
	</div>
</template>
