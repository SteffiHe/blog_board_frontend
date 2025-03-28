<script setup>
    import {onMounted, ref} from 'vue';
	import Tag from './Tag.vue'
	import Rate from './Rate.vue'
	import Recommendation from './Recommendation.vue'

	///////////////////////////////////////////////
	// IDs to be used for the respective DOM elements in the template
	///////////////////////////////////////////////

	const MODAL_DROPDOWN_TRIGGER_ID = 'dropdownMenuButton'
	const MODAL_DROPDOWN_ITEM_EDIT = 'dropdownItemEdit'
	const MODAL_DROPDOWN_ITEM_DELETE = 'dropdownItemDelete'
	const MODAL_DROPDOWN_ITEM_MOVE = 'dropdownItemMove'


	const props = defineProps({
		otherColumns: {
			type: Array,
			required: true
		},
		article: {
			type: Object,
			required: true
		}
	});

	const emit = defineEmits([
		'delete-article',
		'move-article',
		'trigger-edit'
	]);

	let collapsed = ref('collapsed')

	function toggleCollapsed() {
		if(collapsed.value.length === 0) {
			collapsed.value = 'collapsed'
		} else {
			collapsed.value = ''
		}
	}

	const submenuRef = ref(null);
	const isLeft = ref(false);

	const checkSubmenuPosition = () => {
		if (submenuRef.value) {
			const submenu = submenuRef.value.getBoundingClientRect()

			if(!submenuRef.value.classList.contains('dropdown-submenu-left')) {
				// Check if the right edge of the submenu goes beyond the window's width
				if (submenu.right > window.innerWidth) {
					submenuRef.value.classList.add('dropdown-submenu-left')
					submenuRef.value.classList.remove('dropdown-submenu-right')
				} else {
					submenuRef.value.classList.remove('dropdown-submenu-left')
					submenuRef.value.classList.add('dropdown-submenu-right')
				}
			}
		}
	}

	function deleteArticle() {
		emit('delete-article', props.article.id)
	}

	function moveArticle(newColumnId) {
		emit('move-article', props.article.id, newColumnId)
	}

	function triggerEdit() {
		emit('trigger-edit', props.article.id)
	}

	onMounted(() => {
		// Check position on mount in case the default position needs adjustment
		checkSubmenuPosition()
	})
	
</script>

<template>
	<div class="card bg-light mt-3" :data-testid="`article-${article.title}`">
		<div class="card-header d-flex justify-content-between align-items-center">
			<h5 class="collapsed mb-0" data-testid="article-title">{{ article.title }}</h5>
			<div class="dropdown">
				<button class="btn btn-link p-0 m-0" type="button" :id="MODAL_DROPDOWN_TRIGGER_ID" data-bs-toggle="dropdown" aria-expanded="false">
					<img src="../assets/hamburger.svg" alt="Edit Article" height="24" width="24">
				</button>
				<ul class="dropdown-menu" :aria-labelledby="MODAL_DROPDOWN_TRIGGER_ID">
					<li class="d-flex justify-content-between align-items-center dropdown-submenu">
						<a class="dropdown-item" href="#" @mouseover="checkSubmenuPosition" :id="MODAL_DROPDOWN_ITEM_MOVE">Move</a>
						<span class="me-2">&raquo</span>
						<ul class="dropdown-menu dropdown-submenu-right" href="#" ref="submenuRef">
							<li v-for="column in otherColumns">
								<a class="dropdown-item" href="#"  @click="moveArticle(column.id)">{{column.name}}</a>
							</li>
						</ul>
					</li>
					<li><a class="dropdown-item" href="#" @click="triggerEdit" :id="MODAL_DROPDOWN_ITEM_EDIT">Edit</a></li>
					<li><a class="dropdown-item" href="#" @click="deleteArticle":id="MODAL_DROPDOWN_ITEM_DELETE" >Delete</a></li>
				</ul>
			</div>
		</div>
		<div :class="['card-body', collapsed]" @click="toggleCollapsed()">
			<p class="card-text" data-testid="article-content"> {{ article.content }} </p>
			<p class="card-text">
				<small class="text-muted">
					Created on {{ article.createTime }} 
					<span v-if="article.author"> by {{ article.author }}</span>
				</small>
			</p>
		</div>
		<div class="card-footer">
			<ul class="list-group list-group-flush list-unstyled">
				<li >
					<Rate :rate="article.rate" />
					<Recommendation :recommendation="article.recommendation" />
				</li>
				<li>
					<Tag v-for="tag in article.tags" :tag-value="tag" />
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
	.collapsed {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.dropdown-submenu {
		position: relative;
	}

	.dropdown-submenu-right {
		left: 100%;
		right: auto;
		top: 0;
	}

	.dropdown-submenu-left {
		left: auto;
		right: 100%;
		top: 0;
	}

	.dropdown-menu > li:hover > * {
		display: block;
	}
</style>
