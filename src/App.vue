<script setup>
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import Board from './components/Board.vue'
import Modal from './components/Modal.vue'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

const tags = ref([])
const categories = ref([])
const columns = ref([])
const authors = ref([])
const rates = ref([])
const recommendations = ref([])
const modalRef = ref(null)

const title = 'Database Blog'
//const urlBackend = 'http://localhost:8080'
const urlBackend = '/api'


/**
 * Calls the showModal() function in Modal.vue, assuming the component is registered and referenced.
 */
function showModal(article = null, columnId = null) {
    if (modalRef.value) {
        modalRef.value.showModal(article, columnId)
    }
}

/**
 * Calls showModal() in editing mode.
 */
function triggerEdit(articleId) {
    for (let column of columns.value) {
        const index = column.articles.findIndex(a => a.id === articleId)
        if (index > -1) {
            const article = column.articles[index]
            console.log("Triggering edit for article: ", article)
            showModal(article, column.id)
            return
        }
    }
}


////////////////////////////////////////////////////////////////
// API calls to fetch data from Backend //
////////////////////////////////////////////////////////////////

async function loadTags() {
    try {
        const response = await fetch(`${urlBackend}/tag/getAllTags`);
        if (!response.ok) throw new Error('Fehler beim Laden der Tags');
        const tag_temp = await response.json();

        // Extract names into an array
        tags.value = tag_temp.map(tag => tag.name);

        console.log("Tags:", tags.value);
       
    } catch (error) {
        console.error(error);
    }
}

async function loadRates() {
    try {
        const response = await fetch(`${urlBackend}/rate/getAllRates`);
        if (!response.ok) throw new Error('Fehler beim Laden der Rates');
        const rate_temp = await response.json();

        // Extract names into an array
        rates.value = rate_temp.map(rate => rate.name);

        console.log("Rates:", rates.value);
       
    } catch (error) {
        console.error(error);
    }
}

async function loadRecommendations() {
    try {
        const response = await fetch(`${urlBackend}/recommendation/getAllRecommendations`);
        if (!response.ok) throw new Error('Fehler beim Laden der Recommendations');
        const recommendation_temp = await response.json();

        // Extract names into an array
        recommendations.value = recommendation_temp.map(recommendation => recommendation.name);

        console.log("Recommendations:", recommendations.value);
       
    } catch (error) {
        console.error(error);
    }
}

async function loadCategories() {
  try {
      const response = await fetch(`${urlBackend}/category/getAllCategories`);
      if (!response.ok) throw new Error('Fehler beim Laden der Kategorien');
      const category_temp = await response.json();

      // Extract names into an array
      categories.value = category_temp // category_temp.map(category => category.name);


      console.log("Categories:", categories.value);
     
  } catch (error) {
      console.error(error);
  }
}

async function loadColumns() {
  try {
      const response = await fetch(`${urlBackend}/article/getAllArticlesWithAuthornameDTO`);
      if (!response.ok) throw new Error('Fehler beim Laden der Artikel');
      const article_temp = await response.json();

      columns.value = transformArticles(article_temp);
      console.log("Transformed articles:", columns.value);
     
  } catch (error) {
      console.error(error);
  }
}

async function LoadAuthor() {
    try {
        const response = await fetch(`${urlBackend}/user/getAllUsersVO`);
        if (!response.ok) throw new Error('Fehler beim Laden der User');
        
        const authors_temp = await response.json(); 
        authors.value = authors_temp.data;
        console.log("Authors:", authors.value);
    } catch (error) {
        console.error(error);
    }
}

function transformArticles(blogs) {

    // Create an object to store categories by their id
    const categoriesMap = {};

    // Iterate over articles and populate the categoriesMap
    blogs.forEach(entry => {
        const categoryId = entry.category.id;
        const categoryName = entry.category.name;

        // If the category does not exist in the map, create it
        if (!categoriesMap[categoryId]) {
            categoriesMap[categoryId] = {
                id: categoryId,
                name: categoryName,
                articles: []  // Initialize an empty array for articles
            };
        }

        // Prepare tags as an array of tag names. Handle the case where entry.tags is null or undefined
        const tagNames = entry.tags ? entry.tags.map(tag => tag.name) : [];

        // Handle null rate safely
        const rateName = entry.rate ? entry.rate.name : null; 
        const recommendationName = entry.recommendation ? entry.recommendation.name : null;

        // Push the article into the corresponding category
        categoriesMap[categoryId].articles.push({
            id: entry.id,
            title: entry.title,
            content: entry.content,
            author: entry.author,
            createTime: entry.createTime,
            rate: rateName,
            recommendation: recommendationName,
            tags: tagNames
        });
    });

    // Convert categoriesMap to an array of categories
    return Object.values(categoriesMap);
}


async function deleteArticle(id) {
    try {
        console.log("Deleting article with id ", id);
        const response = await fetch(`${urlBackend}/article/deleteArticle/${id}`, { method: 'DELETE' });

        if (!response.ok) throw new Error('Fehler beim Löschen des Artikels');

        await loadColumns(); // Aktualisiert das Board
    } catch (error) {
        console.error(error);
    }
}


async function moveArticle(articleId, newColumnId) {

    console.log("Moving article with id ", articleId, "to column with id ", newColumnId);
    try {
        const name = columns.value.find(column => column.id === newColumnId).name;
        const response = await fetch(`${urlBackend}/article/updateCategory/${articleId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        if (!response.ok) throw new Error('Fehler beim Verschieben des ArticleCard');

        await loadColumns(); // Aktualisiert das Board
    } catch (error) {
        console.error(error);
    }
}

async function createArticle(column, title, content, authorName, tagsName, rate, recommendation) {

    const tags = transformTags(tagsName);
    const category = categories.value.find(c => c.id === column).name;
    const author = authors.value.find(a => a.username === authorName).id;

    console.log("Creating article ", JSON.stringify({ category, title, content, author, tags, rate , recommendation}));

    try {
        const response = await fetch(`${urlBackend}/article/insertArticle`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, title, content, author, tags, rate, recommendation })
        });

        if (!response.ok) throw new Error('Fehler beim Erstellen des Artikels');

        await loadColumns(); // Aktualisiert das Board
    } catch (error) {
        console.error(error);
    }
}

function transformTags(tagArray) {
    return tagArray.map(tag => ({ name: tag }));
}



async function editArticle(column, id, title, content, authorName, tagsName, rate, recommendation) {

    const tags = transformTags(tagsName);
    const category = columns.value.find(c => c.id === column).name;
    const author = authors.value.find(a => a.username === authorName).id;

    console.log("Edit article ", JSON.stringify({ category, title, content, author, tags, rate, }));

    try {
        const response = await fetch(`${urlBackend}/article/updateArticle/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, title, content, author, tags, rate, recommendation })
        });

        if (!response.ok) throw new Error('Fehler beim Bearbeiten des Artciles');

        await loadColumns(); // Aktualisiert das Board
    } catch (error) {
        console.error(error);
    }
}


onMounted(() => {

    loadTags()
    loadCategories()
    loadColumns()
    LoadAuthor()
    loadRates()
    loadRecommendations()
})

</script>

<template>
  <Header :title="title" @show-modal="showModal"/>
  <Board :columns="columns"  @delete-article="deleteArticle" @move-article="moveArticle" @trigger-edit="triggerEdit"/>
  <Modal :tags="tags" :categories="categories" :rates="rates" :recommendations="recommendations"  :authors="authors" ref="modalRef" @create-article="createArticle" @edit-article="editArticle"/>
</template>

<style scoped>
</style>
