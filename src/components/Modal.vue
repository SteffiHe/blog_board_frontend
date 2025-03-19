<script setup>
import { computed, onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'
import Tag from '@/components/Tag.vue';
import Rate from '@/components/Rate.vue';
import Recommendation from '@/components/Recommendation.vue';

///////////////////////////////////////////////
// IDs to be used for the respective DOM elements in the template
///////////////////////////////////////////////

const MODAL_ID = 'modalRoot' // for the modal's root element
const MODAL_SELECT_COLUMN_ID = 'modalSelectColumn' // for the selector in the modal's header
const MODAL_SELECT_AUTHOR_ID = 'modalSelectColumn' // for the selector in the modal's header
const MODAL_BUTTON_X_ID = 'modalButtonX'

const MODAL_INPUT_TITLE_ID = 'modalInputTitle' // for the input where users enter the article's title
const MODAL_HELPER_TITLE_ID = 'modalHelperTitle' // for the helper showing the length of entered title
const MODAL_INPUT_CONTENT_ID = 'modalInputContent' // for the textarea where users enter the article's description

const MODAL_DROPDOWN_TRIGGER_TAG_ID = 'modalDropdownTriggerTag' // for the button that toggles the tag selection dropdown
const MODAL_DROPDOWN_MENU_TAG_ID = 'modalDropdownMenuTag' // for the root element of the tag selection dropdown's menu
const MODAL_CHECKBOX_BASE_TAG_ID = 'modalCheckboxTag' // base string for the checkboxes in the dropdown, concatenate with the respective tag's name

const MODAL_DROPDOWN_TRIGGER_RATE_ID = 'modalDropdownTriggerRate' // for the button that toggles the rate selection dropdown
const MODAL_DROPDOWN_MENU_RATE_ID = 'modalDropdownMenuRate' // for the root element of the rate selection dropdown's menu
const MODAL_RADIOBUTTON_BASE_RATE_ID = 'modalRadiobuttonRate' // base string for the radiobutton in the dropdown, concatenate with the respective rate's name

const MODAL_DROPDOWN_TRIGGER_RECOMMENDATION_ID = 'modalDropdownTriggerRecommendation' // for the button that toggles the recommendation selection dropdown
const MODAL_DROPDOWN_MENU_RECOMMENDATION_ID = 'modalDropdownMenuRecommendation' // for the root element of the recommendation selection dropdown's menu
const MODAL_RADIOBUTTON_BASE_RECOMMENDATION_ID = 'modalRadiobuttonRecommendation' // base string for the radiobutton in the dropdown, concatenate with the respective recommendation's name

const MODAL_BUTTON_CANCEL = 'modalButtonCancel' // for the modal's cancel button
const MODAL_BUTTON_SUBMIT = 'modalButtonSubmit' // for the modal's submit button

///////////////////////////////////////////////
// implementation
///////////////////////////////////////////////

// declare props
const props = defineProps({
    tags: {
        type: Array,
        required: true
    },
    authors: {
        type: Array,
        required: true
    },
    categories: {
        type: Array,
        required: true
    }, 
    rates: {
        type: Array,
        required: true
    }, 
    recommendations: {
        type: Array,
        required: true
    }

})

// declare emits
const emit = defineEmits([
    'create-article',
    'edit-article'
])

// declare exposed methods
defineExpose({ showModal })

// reactive variables that are modified by the UI
const articleColumn = ref(0)
const articleId = ref('')
const articleTitle = ref('')
const articleContent = ref('')
const articleAuthor = ref('')
const articleTags = computed(
    () => props.tags.map(t =>
        ref({
            name: t,
            selected: false
        })
    )
)
const articleRate = ref('');
const articleRecommendation = ref('');

const mode = ref('create')

// the modal doesn't need to be reactive because we only access it in the script block
let modal = null

/**
 * Instantiates a Bootstrap Modal object and binds it to the corresponding DOM element via modalId.
 */
function createModal() {
    modal = new Modal('#' + MODAL_ID)
}

/**
 * Wrapper for Bootstrap's Modal.show() that is exposed so that external components can toggle the modal.
 * Resets the article value before opening the modal so that user can start fresh every time.
 */
function showModal(article = null, columnId = null ) {

    if(article == null) {
        // reset the article values
        articleColumn.value = 0
        articleId.value = ''
        articleTitle.value = ''
        articleContent.value = ''
        articleAuthor.value = ''
        articleRate.value = ''
        articleRecommendation.value = ''
        articleTags.value.forEach(t => t.value.selected = false)
        mode.value = 'Create'
    } else {
        // set the article values to the values of the article to be edited
        articleColumn.value = columnId
        articleId.value = article.id
        articleTitle.value = article.title
        articleContent.value = article.content
        articleAuthor.value = article.author
        articleRate.value = article.rate
        articleRecommendation.value = article.recommendation
        articleTags.value.forEach(t => 
            t.value.selected = article.tags.includes(t.value.name)
        )
        mode.value = 'Edit'
    }

    modal.show()
}

/**
 * Emits a createArticle event or editArticle with the current article properties and closes the modal.
 */
function submitModal() {


    if(mode.value === 'Edit') {
        emit(
            'edit-article',
            articleColumn.value,
            articleId.value,
            articleTitle.value,
            articleContent.value,
            articleAuthor.value,
            articleTags.value.filter(t => t.value.selected).map(t => t.value.name),
            articleRate.value,
            articleRecommendation.value
        )
    } else {
        emit(
            'create-article',
            articleColumn.value,
            articleTitle.value,
            articleContent.value,
            articleAuthor.value,
            articleTags.value.filter(t => t.value.selected).map(t => t.value.name),
            articleRate.value,
            articleRecommendation.value
        )
    }

    closeModal()
}

/**
 * Wrapper for Bootstrap's Modal.hide().
 */
function closeModal() {
    modal.hide()
}

/**
 * Returns the modal's title depending on the current mode.
 */
function getModalTitle() {
    // const trailing = mode.value !== 'Edit' ? ' article' : ' article'
    return mode.value + ' article'
}


// call createModal() as soon as the component is mounted
onMounted(createModal)
</script>

<template>
    <div class="modal" :id="MODAL_ID" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">

                <!-- Header of the modal containing the modal's headline and the column selector for the article -->
                <div class="modal-header">
                    <h5 class="modal-title me-3">{{getModalTitle()}}</h5>
                    <button :id="MODAL_BUTTON_X_ID" type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
                </div>

                <!-- Body of the modal containing inputs for the article's title, content and tags -->
                <div class="modal-body">
                    <form @submit.prevent="submitModal">
                        
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div>Catagory </div>
                            <div class="d-inline-block" >
                                <select 
                                    :id="MODAL_SELECT_COLUMN_ID" 
                                    class="form-select" 
                                    :class="{ 'is-invalid': !articleColumn }"
                                    aria-label="Default select example" 
                                    v-model="articleColumn"
                                    required>
                                    <option v-for="category in categories" :value="category.id">{{category.name}}</option>
                                </select>
                                <div v-if="articleColumn === ''" class="invalid-feedback">Please select a Catagory.</div>
                            </div>
                        </div>
                        
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div>Author </div>
                            <div class="d-inline-block" >
                                <select 
                                    :id="MODAL_SELECT_AUTHOR_ID" 
                                    class="form-select" 
                                    :class="{ 'is-invalid': !articleAuthor }"
                                    aria-label="Default select example" 
                                    v-model="articleAuthor"
                                    required>
                                    <option v-for="author in authors" :value="author.id">{{author.username}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label :for="MODAL_INPUT_TITLE_ID" class="form-label">Article Title</label>
                            <input 
                                :id="MODAL_INPUT_TITLE_ID" 
                                v-model="articleTitle" 
                                type="text" 
                                class="form-control" 
                                :class="{ 'is-invalid': !articleTitle }"
                                :aria-describedby="MODAL_HELPER_TITLE_ID" 
                                maxlength="20"
                                required>
                            <div :id="MODAL_HELPER_TITLE_ID" class="form-text">{{ articleTitle.length }}/20 characters</div>                           
                        </div>

                        <div class="mb-3">
                            <label :for="MODAL_INPUT_CONTENT_ID" class="form-label">Article Content</label>
                            <textarea 
                                :id="MODAL_INPUT_CONTENT_ID" 
                                v-model="articleContent" 
                                class="form-control" 
                                :class="{ 'is-invalid': !articleContent }"
                                rows="3"
                                required>
                            </textarea>
                        </div>

                        <div class="d-flex gap-3 mb-3" >

                                <div class="dropdown">
                                    <button  :id="MODAL_DROPDOWN_TRIGGER_TAG_ID" class="btn btn-outline-primary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
                                        Select tags
                                    </button>

                                    <ul :id="MODAL_DROPDOWN_MENU_TAG_ID" class="dropdown-menu">
                                        <li v-for="(tag, index) in articleTags" :key="tag.value.name">
                                            <div class="dropdown-item-text">
                                                <div class="form-check">
                                                    <input 
                                                        :id="MODAL_CHECKBOX_BASE_TAG_ID + tag.value.name" 
                                                        type="checkbox" 
                                                        class="form-check-input" 
                                                        v-model="articleTags[index].value.selected"
                                                    >
                                                    <label class="form-check-label" :for="tag">
                                                        <Tag :tag-value="tag.value.name" />
                                                    </label>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div class="dropdown">
                                    <button  
                                            :id="MODAL_DROPDOWN_TRIGGER_RATE_ID" 
                                            class="btn btn-outline-primary dropdown-toggle" 
                                            href="#" 
                                            role="button" 
                                            data-bs-toggle="dropdown" 
                                            data-bs-auto-close="outside" 
                                            aria-expanded="false">
                                        Select rate
                                    </button>

                                    <ul :id="MODAL_DROPDOWN_MENU_RATE_ID" class="dropdown-menu">
                                        <li v-for="(rate, index) in rates" :key="rate">
                                            <div class="dropdown-item-text">
                                                <div class="form-check">
                                                    <input 
                                                        :id="MODAL_RADIOBUTTON_BASE_RATE_ID + rate" 
                                                        type="radio" 
                                                        class="form-check-input" 
                                                        v-model="articleRate"
                                                        name="rateSelection"
                                                        :value="rate"
                                                    >
                                                    <label class="form-check-label" :for="rate">
                                                        <Rate :rate="rate" />
                                                    </label>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div class="dropdown">
                                    <button  
                                            :id="MODAL_DROPDOWN_TRIGGER_RECOMMENDATION_ID" 
                                            class="btn btn-outline-primary dropdown-toggle" 
                                            href="#" 
                                            role="button" 
                                            data-bs-toggle="dropdown" 
                                            data-bs-auto-close="outside" 
                                            aria-expanded="false">
                                        Select rec.
                                    </button>

                                    <ul :id="MODAL_DROPDOWN_MENU_RECOMMENDATION_ID" class="dropdown-menu">
                                        <li v-for="(recommendation, index) in recommendations" :key="recommendation">
                                            <div class="dropdown-item-text">
                                                <div class="form-check">
                                                    <input 
                                                        :id="MODAL_RADIOBUTTON_BASE_MODAL_DROPDOWN_MENU_RECOMMENDATION_ID + recommendation" 
                                                        type="radio" 
                                                        class="form-check-input" 
                                                        v-model="articleRecommendation"
                                                        name="recommendationSelection"
                                                        :value="recommendation"
                                                    >
                                                    <label class="form-check-label" :for="recommendation">
                                                        <Recommendation :recommendation="recommendation" />
                                                    </label>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                        </div>
                        
                    </form>
                </div>

                <!-- Footer of the modal containing the submit and close buttons -->
                <div class="modal-footer">
                    <button :id="MODAL_BUTTON_CANCEL" type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                    <button :id="MODAL_BUTTON_SUBMIT" type="submit" class="btn btn-primary" @click="submitModal">{{mode}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* no custom stylesheet necessary thanks to Bootstrap */
</style>