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
		const colSize_lg = Math.floor(12 / (columns.length || 1)); // Avoid division by zero
		const colSize_md = Math.floor(12 / ( (columns.length -1) || 1)); 
		return `col-12 col-md-${colSize_md} col-lg-${colSize_lg}`;
	});
	
</script>

<template>
	<div class="container">
		<div class="row">
            <div v-for="column in columns" :key="column.id" :class="columnClass" :id="'column-' + column.name">
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
